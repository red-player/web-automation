"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSelector = void 0;
const getActiveSelector = async (page, name) => {
    if (!name)
        return undefined;
    const normalizedName = name.replace(/\s+/g, '');
    // List of candidate selectors ordered by precision/likelihood
    const candidates = [
        // 1. Direct form control name attributes (common in Angular/React/Vue)
        `input[formcontrolname="${normalizedName}"]`,
        `input[formcontrolname="${name}"]`,
        `textarea[formcontrolname="${normalizedName}"]`,
        `textarea[formcontrolname="${name}"]`,
        `p-dropdown[formcontrolname="${normalizedName}"]`,
        `p-dropdown[formcontrolname="${name}"]`,
        `select[formcontrolname="${normalizedName}"]`,
        `select[formcontrolname="${name}"]`,
        // 2. Direct ID or Name attribute matches
        `[id="${normalizedName}"]`,
        `[id="${name}"]`,
        `[name="${normalizedName}"]`,
        `[name="${name}"]`,
        // 3. Label associations (sibling lookups)
        `label:has-text("${name}") + input`,
        `label:has-text("${normalizedName}") + input`,
        `label:has-text("${name}") + textarea`,
        `label:has-text("${name}") + p-dropdown`,
        `label:has-text("${name}") + select`,
        // 4. Placeholders (exact and case-insensitive fuzzy)
        `input[placeholder="${name}"]`,
        `input[placeholder*="${name}" i]`,
        `textarea[placeholder="${name}"]`,
        `textarea[placeholder*="${name}" i]`,
        // 5. Semantic roles and text associations (Playwright built-in syntax)
        `role=button[name="${name}"i]`,
        `role=textbox[name="${name}"i]`,
        `role=combobox[name="${name}"i]`,
        // 6. Interactive elements with text matches
        `button:has-text("${name}")`,
        `button:has-text("${normalizedName}")`,
        `a:has-text("${name}")`,
        `a:has-text("${normalizedName}")`,
        // 7. General text containers
        `span:has-text("${name}")`,
        `span:has-text("${normalizedName}")`,
        `div.label:has-text("${name}")`,
        `div.label:has-text("${normalizedName}")`,
        `div:has-text("${name}")`,
        `text="${name}"`
    ];
    const uniqueCandidates = Array.from(new Set(candidates));
    // Wait for the page load state once at the start of resolution
    try {
        await page.waitForLoadState('load');
        await page.waitForLoadState('domcontentloaded');
        // Wait briefly for network idle to allow async component rendering
        await page.waitForLoadState('networkidle').catch(() => { });
    }
    catch (e) {
        console.warn("⚠️ Timeout waiting for load states, resolving selectors with current DOM...");
    }
    for (const selector of uniqueCandidates) {
        try {
            const elements = page.locator(selector);
            const count = await elements.count();
            if (count > 0) {
                // Verify that at least one matching element is visible
                for (let i = 0; i < count; i++) {
                    if (await elements.nth(i).isVisible()) {
                        console.log(`🎯 Resolved selector: "${selector}" for target "${name}"`);
                        return selector;
                    }
                }
            }
        }
        catch (err) {
            // Suppress individual selector syntax warnings
        }
    }
    console.error(`❌ No selector could be dynamically resolved for target: "${name}"`);
    return undefined;
};
exports.getActiveSelector = getActiveSelector;
