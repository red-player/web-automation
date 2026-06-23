"use strict";
// formFiller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillFormFields = void 0;
const formValidator_1 = require("./formValidator");
const generateTestInput_1 = require("./generateTestInput");
const pageUtils_1 = require("./pageUtils");
const getActiveSelector_1 = require("./getActiveSelector");
const fillFormFields = async (page, formFields) => {
    for (const field of formFields) {
        const generatedValue = typeof field.value !== 'undefined'
            ? field.value
            : (0, generateTestInput_1.generateTestInput)(field.inputOptions);
        try {
            const resolvedSelector = field.selector ? field.selector : await (0, getActiveSelector_1.getActiveSelector)(page, field.name);
            if (!resolvedSelector) {
                console.error(`❌ Selector not found for field [${field.name}]`);
                continue;
            }
            const commonOptions = {
                selector: resolvedSelector,
                selectorWithoutXpath: field.name,
                value: String(generatedValue),
                valueType: field.valueType,
                required: field.required,
                exactLength: field.exactLength,
                minLength: field.minLength,
                maxLength: field.maxLength
            };
            switch (field.type) {
                case 'input':
                case 'textarea':
                    await (0, pageUtils_1.performActionOnElement)(page, {
                        action: 'fill',
                        ...commonOptions
                    });
                    await (0, formValidator_1.validateFrontEndBehavior)(page, {
                        expectedValue: String(generatedValue),
                        selector: resolvedSelector,
                        fieldName: field.name,
                        rules: {
                            exactLength: field.exactLength,
                            minLength: field.minLength,
                            maxLength: field.maxLength,
                            mode: field.valueType === 'email' ? 'email' : undefined
                        }
                    });
                    break;
                case 'dropdown':
                    await (0, pageUtils_1.performActionOnElement)(page, {
                        action: 'click',
                        selector: resolvedSelector
                    });
                    await (0, pageUtils_1.performActionOnElement)(page, {
                        action: 'click',
                        selector: field.dropdownOptionSelector || `text="${generatedValue}"`
                    });
                    break;
                case 'radio':
                    if (field.value) {
                        await (0, pageUtils_1.performActionOnElement)(page, {
                            action: 'click',
                            ...commonOptions
                        });
                    }
                    break;
                case 'date':
                    await (0, pageUtils_1.performActionOnElement)(page, {
                        action: 'fill',
                        ...commonOptions
                    });
                    break;
                default:
                    console.warn(`⚠️ Unsupported field type: ${field.type}`);
            }
        }
        catch (err) {
            console.error(`❌ Error filling [${field.name}]:`, err);
            const fs = require('fs');
            const path = require('path');
            const dir = path.join(process.cwd(), 'screenshots');
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            await page.screenshot({ path: path.join(dir, `error-${field.name}.png`), fullPage: true });
        }
    }
};
exports.fillFormFields = fillFormFields;
