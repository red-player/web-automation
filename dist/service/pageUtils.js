"use strict";
// pageUtils.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performActionOnElement = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getActiveSelector_1 = require("./getActiveSelector");
const isValidByType = (value, type) => {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return /^\d+$/.test(value);
        case 'alphanumeric':
            return /^[a-z0-9]+$/i.test(value);
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'date':
            return !isNaN(Date.parse(value));
        default:
            return true;
    }
};
const performActionOnElement = async (page, { action, selector, isXpath = true, value, waitOptions = { state: 'visible', timeout: 10000 }, actionOptions, valueType, required, exactLength, minLength, maxLength }) => {
    const resolvedSelector = isXpath === true ? selector : await (0, getActiveSelector_1.getActiveSelector)(page, selector ?? '');
    if (!resolvedSelector) {
        console.error(`❌ Could not resolve a selector for "${selector}"`);
        return;
    }
    if (typeof resolvedSelector !== 'string') {
        console.error(`❌ Selector is not a string:`, resolvedSelector);
        return;
    }
    if (!selector) {
        console.error('❌ No selector provided.');
        return;
    }
    await page.waitForSelector(resolvedSelector, waitOptions);
    let failedValidation = false;
    const valueStr = typeof value === 'string' ? value : Array.isArray(value) ? value.join(',') : '';
    // 🔍 Validation
    if (required && !valueStr) {
        console.error(`❌ [${resolvedSelector}] Required value is missing.`);
        failedValidation = true;
    }
    if (valueType && valueStr && !isValidByType(valueStr, valueType)) {
        console.error(`❌ [${resolvedSelector}] Value "${valueStr}" does not match type ${valueType}.`);
        failedValidation = true;
    }
    if (exactLength && valueStr.length !== exactLength) {
        console.error(`❌ [${resolvedSelector}] Value "${valueStr}" length should be exactly ${exactLength}.`);
        failedValidation = true;
    }
    if (minLength && valueStr.length < minLength) {
        console.error(`❌ [${resolvedSelector}] Value "${valueStr}" is shorter than minLength ${minLength}.`);
        failedValidation = true;
    }
    if (maxLength && valueStr.length > maxLength) {
        console.error(`❌ [${resolvedSelector}] Value "${valueStr}" exceeds maxLength ${maxLength}.`);
        failedValidation = true;
    }
    // 🧠 Do the action
    switch (action) {
        case 'click':
            await page.click(resolvedSelector, actionOptions);
            break;
        case 'fill':
            if (typeof valueStr !== 'string')
                throw new Error(`"fill" action requires a string value.`);
            await page.fill(resolvedSelector, valueStr, actionOptions);
            break;
        case 'type':
            if (typeof valueStr !== 'string')
                throw new Error(`"type" action requires a string value.`);
            await page.type(resolvedSelector, valueStr, actionOptions);
            break;
        case 'check':
            await page.check(resolvedSelector, actionOptions);
            break;
        case 'uncheck':
            await page.uncheck(resolvedSelector, actionOptions);
            break;
        case 'selectOption':
            if (!value)
                throw new Error(`"selectOption" action requires a value.`);
            await page.selectOption(resolvedSelector, value, actionOptions);
            break;
        case 'hover':
            await page.hover(resolvedSelector, actionOptions);
            break;
        default:
            throw new Error(`Unsupported action type: ${action}`);
    }
    // 📸 If failed validation but front-end allowed the value
    if (failedValidation) {
        const inputValue = await page.$eval(resolvedSelector, (el) => el?.value || el?.textContent || '');
        if (inputValue?.includes(valueStr)) {
            const screenshotPath = path_1.default.join('screenshots', `invalid_input_${Date.now()}.png`);
            fs_1.default.mkdirSync('screenshots', { recursive: true });
            await page.screenshot({ path: screenshotPath });
            console.warn(`⚠️ Frontend accepted invalid value: "${valueStr}" for selector [${resolvedSelector}]. Screenshot saved at: ${screenshotPath}`);
        }
        else {
            console.log(`✅ Frontend correctly rejected invalid input "${valueStr}" for [${resolvedSelector}]`);
        }
    }
};
exports.performActionOnElement = performActionOnElement;
