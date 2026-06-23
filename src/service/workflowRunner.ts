import { Page } from 'playwright';
import path from 'path';
import fs from 'fs';
import { Workflow, WorkflowStep } from './workflowTypes';
import { performActionOnElement } from './pageUtils';
import { fillFormFields } from './formFiller';
import { waitForApiResponse } from './waitForResponse';
import { navigateSidebarMenu } from './screenNavigate';
import { getActiveSelector } from './getActiveSelector';

export interface WorkflowResult {
  success: boolean;
  error?: string;
  logs: string[];
}

/**
 * Utility to replace placeholders like {{variableName}} with their runtime values.
 */
const resolveTemplates = (val: any, variables: Record<string, any>): any => {
  if (typeof val === 'string') {
    return val.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
      const trimmedKey = key.trim();
      return variables[trimmedKey] !== undefined ? String(variables[trimmedKey]) : `{{${trimmedKey}}}`;
    });
  }
  return val;
};

export const runWorkflow = async (
  page: Page,
  workflow: Workflow,
  variables: Record<string, any> = {}
): Promise<WorkflowResult> => {
  const logs: string[] = [];
  const log = (msg: string) => {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${msg}`;
    console.log(formatted);
    logs.push(formatted);
  };

  log(`🚀 Starting workflow: "${workflow.name}"`);
  log(`📋 Description: ${workflow.description || 'No description provided'}`);

  try {
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      log(`🔄 [Step ${i + 1}/${workflow.steps.length}] Executing step: "${step.type}"`);

      // Resolve templated properties
      const resolvedUrl = resolveTemplates(step.url, variables);
      const resolvedValue = resolveTemplates(step.value, variables);
      const resolvedText = resolveTemplates(step.text, variables);
      const resolvedSelector = resolveTemplates(step.selector, variables);
      const resolvedScreenshotName = resolveTemplates(step.screenshotName, variables);

      switch (step.type) {
        case 'goto':
          if (!resolvedUrl) throw new Error('Missing URL for "goto" step.');
          log(`  Navigating to URL: ${resolvedUrl}`);
          await page.goto(resolvedUrl, { timeout: step.timeout || 30000 });
          break;

        case 'click':
          log(`  Clicking element: ${step.name || resolvedSelector}`);
          await performActionOnElement(page, {
            action: 'click',
            selector: resolvedSelector || step.name,
            isXpath: step.isXpath ?? false,
            waitOptions: { state: 'visible', timeout: step.timeout || 10000 }
          });
          break;

        case 'fill':
          log(`  Filling element: ${step.name || resolvedSelector} with value: ${resolvedValue}`);
          await performActionOnElement(page, {
            action: 'fill',
            selector: resolvedSelector || step.name,
            isXpath: step.isXpath ?? false,
            value: resolvedValue,
            waitOptions: { state: 'visible', timeout: step.timeout || 10000 }
          });
          break;

        case 'fillForm':
          if (!step.fields) throw new Error('Missing fields array for "fillForm" step.');
          log(`  Filling form fields (Total: ${step.fields.length})`);
          // Apply runtime variable overrides to form fields
          const fieldsToFill = step.fields.map((field) => {
            const overrideValue = variables[field.name];
            if (overrideValue !== undefined) {
              log(`    Applying override: Field "${field.name}" = "${overrideValue}"`);
              return { ...field, value: overrideValue };
            }
            return field;
          });
          await fillFormFields(page, fieldsToFill);
          break;

        case 'selectOption':
          log(`  Selecting option in element: ${step.name || resolvedSelector} with option: ${resolvedValue}`);
          await performActionOnElement(page, {
            action: 'selectOption',
            selector: resolvedSelector || step.name,
            isXpath: step.isXpath ?? false,
            value: resolvedValue,
            waitOptions: { state: 'visible', timeout: step.timeout || 10000 }
          });
          break;

        case 'check':
          log(`  Checking element: ${step.name || resolvedSelector}`);
          await performActionOnElement(page, {
            action: 'check',
            selector: resolvedSelector || step.name,
            isXpath: step.isXpath ?? false,
            waitOptions: { state: 'visible', timeout: step.timeout || 10000 }
          });
          break;

        case 'uncheck':
          log(`  Unchecking element: ${step.name || resolvedSelector}`);
          await performActionOnElement(page, {
            action: 'uncheck',
            selector: resolvedSelector || step.name,
            isXpath: step.isXpath ?? false,
            waitOptions: { state: 'visible', timeout: step.timeout || 10000 }
          });
          break;

        case 'waitForSelector':
          log(`  Waiting for selector: ${step.name || resolvedSelector}`);
          const resolved = step.isXpath === true ? resolvedSelector : await getActiveSelector(page, resolvedSelector || step.name || '');
          if (!resolved) {
            throw new Error(`Failed to dynamically resolve selector for wait step: ${resolvedSelector || step.name}`);
          }
          await page.waitForSelector(resolved, { state: 'visible', timeout: step.timeout || 10000 });
          break;

        case 'waitForResponse':
          if (!step.urlContains) throw new Error('Missing urlContains for "waitForResponse" step.');
          log(`  Waiting for network response: ${step.method || 'POST'} containing "${step.urlContains}"`);
          await waitForApiResponse(page, {
            urlContains: step.urlContains,
            method: step.method || 'POST',
            statusCode: step.statusCode,
            timeout: step.timeout || 15000
          });
          break;

        case 'assertText':
          if (!resolvedText) throw new Error('Missing text for "assertText" step.');
          log(`  Asserting visible text: "${resolvedText}"`);
          await page.waitForSelector(`text="${resolvedText}"`, { state: 'visible', timeout: step.timeout || 10000 });
          break;

        case 'screenshot':
          const screenshotName = resolvedScreenshotName || `screenshot_${Date.now()}`;
          const screenshotsDir = path.join(process.cwd(), 'screenshots');
          if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
          }
          const screenshotPath = path.join(screenshotsDir, `${screenshotName}.png`);
          log(`  Capturing screenshot. Saving to: ${screenshotPath}`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          break;

        case 'navigateSidebar':
          if (!step.levels) throw new Error('Missing levels configuration for "navigateSidebar" step.');
          log(`  Navigating sidebar: ${JSON.stringify(step.levels)}`);
          await navigateSidebarMenu(page, step.levels, step.timeout || 2000);
          break;

        default:
          throw new Error(`Unsupported step type: "${step.type}"`);
      }

      log(`✅ [Step ${i + 1}/${workflow.steps.length}] Completed successfully.`);
    }

    log(`🎉 Workflow "${workflow.name}" completed successfully!`);
    return { success: true, logs };

  } catch (err: any) {
    const errorMsg = err.message || String(err);
    log(`❌ Error executing workflow: ${errorMsg}`);
    
    // Automatically take an error screenshot
    try {
      const screenshotsDir = path.join(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      const errorScreenshotPath = path.join(screenshotsDir, `error_workflow_${Date.now()}.png`);
      await page.screenshot({ path: errorScreenshotPath, fullPage: true });
      log(`📸 Saved error screenshot to: ${errorScreenshotPath}`);
    } catch (ssErr) {
      log(`⚠️ Failed to capture error screenshot: ${ssErr}`);
    }

    return { success: false, error: errorMsg, logs };
  }
};
