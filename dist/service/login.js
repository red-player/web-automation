"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const pageUtils_1 = require("./pageUtils");
const login = async ({ userName, password, moduleName, page, headless }) => {
    if (!page) {
        const browser = await playwright_1.chromium.launch({ headless: headless || false });
        const context = await browser.newContext();
        page = await context.newPage();
    }
    try {
        await page.goto('https://vividtranstech.in/tancem/#/');
        await (0, pageUtils_1.performActionOnElement)(page, { action: "fill", isXpath: false, selector: 'username', value: userName, valueType: "email", });
        await (0, pageUtils_1.performActionOnElement)(page, { action: "fill", isXpath: false, selector: 'password', value: password, valueType: "string" });
        await (0, pageUtils_1.performActionOnElement)(page, { action: 'click', isXpath: false, selector: 'Log In' });
        await (0, pageUtils_1.performActionOnElement)(page, { action: 'click', selector: `div.label:has-text("${moduleName}")`, waitOptions: { state: 'visible', timeout: 2000 } });
    }
    catch (err) {
        console.error("Error in login function: ", err);
        throw err;
    }
    finally {
        return page;
    }
};
exports.default = login;
