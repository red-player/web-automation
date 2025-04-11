// formValidator.ts
import { Page } from 'playwright';

export interface ValidationCheckOptions {
  expectedValue: string;
  selector: string;
  fieldName: string;
  rules?: {
    exactLength?: number;
    minLength?: number;
    maxLength?: number;
    charSet?: ('alpha' | 'numeric' | 'alphanumeric' | 'specialChars')[];
    allowSpaces?: boolean;
    mode?: 'email' | 'phoneNumber' | 'name';
  };
}

export const validateFrontEndBehavior = async (
  page: Page,
  { expectedValue, selector, fieldName, rules }: ValidationCheckOptions
): Promise<void> => {
  const actualValue = await page.inputValue(selector);
  let failed = false;
  let reason = '';

  // Validate frontend acceptance
  if (actualValue !== expectedValue) {
    failed = true;
    reason = `Frontend modified/blocked input. Expected: "${expectedValue}", Got: "${actualValue}"`;
  }

  // Check length constraints
  const len = actualValue.length;
  if (rules?.exactLength && len !== rules.exactLength) {
    failed = true;
    reason = `Length mismatch. Expected exactly ${rules.exactLength}, got ${len}`;
  }
  if (rules?.minLength && len < rules.minLength) {
    failed = true;
    reason = `Too short. Expected at least ${rules.minLength}, got ${len}`;
  }
  if (rules?.maxLength && len > rules.maxLength) {
    failed = true;
    reason = `Too long. Max ${rules.maxLength}, got ${len}`;
  }

  // Log result
  if (failed) {
    console.error(`❌ [${fieldName}] FAILED: ${reason}`);
    await page.screenshot({ path: `fail-${fieldName}.png`, fullPage: true });
  } else {
    console.log(`✅ [${fieldName}] Passed. Value accepted: "${actualValue}"`);
  }
};
