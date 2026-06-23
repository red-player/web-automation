"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForApiResponse = void 0;
/**
 * Waits for a network response matching the given criteria and returns the parsed JSON body.
 * Includes full debug logs of all requests and responses.
 *
 * @param page Playwright page instance
 * @param options Object with optional URL substring, method, statusCode, and timeout
 * @returns Parsed JSON response body
 */
const waitForApiResponse = async (page, options) => {
    const { urlContains, method = 'POST', statusCode, timeout = 10000, } = options;
    console.log(`🟡 Waiting for API response: ${method} ${urlContains}`);
    let response;
    try {
        response = await page.waitForResponse((res) => {
            const req = res.request();
            const matches = req.method() === method &&
                res.url().includes(urlContains) &&
                (statusCode === undefined || res.status() === statusCode);
            return matches;
        }, { timeout });
    }
    catch (err) {
        console.error(`❌ Timeout after ${timeout}ms waiting for ${method} ${urlContains}`);
        throw err;
    }
    finally {
    }
    let body;
    try {
        body = await response.json();
    }
    catch (err) {
        console.warn(`⚠️ Failed to parse JSON from response: ${err}`);
        body = null;
    }
    return { response, body };
};
exports.waitForApiResponse = waitForApiResponse;
