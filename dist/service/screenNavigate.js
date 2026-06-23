"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigateSidebarMenu = void 0;
const pageUtils_1 = require("./pageUtils");
const navigateSidebarMenu = async (page, levels, timeout = 2000) => {
    const orderedKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
    for (const key of orderedKeys) {
        const label = levels[key];
        if (!label)
            continue;
        console.log(`Navigating to: ${label}`);
        await (0, pageUtils_1.performActionOnElement)(page, {
            action: 'click',
            selector: `span:has-text("${label}")`,
            waitOptions: { state: 'visible', timeout }
        });
    }
};
exports.navigateSidebarMenu = navigateSidebarMenu;
