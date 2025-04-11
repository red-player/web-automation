// formFiller.ts

import { Page } from 'playwright';
import { validateFrontEndBehavior } from './formValidator';
import { generateTestInput } from './generateTestInput';
import { performActionOnElement } from './pageUtils';
import { FormField } from './formFillerTypes';
import { getActiveSelector } from './getActiveSelector';

export const fillFormFields = async (page: Page, formFields: FormField[]) => {
  for (const field of formFields) {
    const generatedValue =
      typeof field.value !== 'undefined'
        ? field.value
        : generateTestInput(field.inputOptions);

    try {
      const resolvedSelector =field.selector ? field.selector : await getActiveSelector(page,field.name) ;

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
          await performActionOnElement(page, {
            action: 'fill',
            ...commonOptions
          });

          await validateFrontEndBehavior(page, {
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
          await performActionOnElement(page, {
            action: 'click',
            selector: resolvedSelector
          });

          await performActionOnElement(page, {
            action: 'click',
            selector: field.dropdownOptionSelector || `text="${generatedValue}"`
          });
          break;

        case 'radio':
          if (field.value) {
            await performActionOnElement(page, {
              action: 'click',
              ...commonOptions
            });
          }
          break;

        case 'date':
          await performActionOnElement(page, {
            action: 'fill',
            ...commonOptions
          });
          break;

        default:
          console.warn(`⚠️ Unsupported field type: ${field.type}`);
      }
    } catch (err) {
      console.error(`❌ Error filling [${field.name}]:`, err);
      await page.screenshot({ path: `error-${field.name}.png`, fullPage: true });
    }
  }
};
