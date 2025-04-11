export const getActiveSelector = async (
    page: any,
    name: string
  ): Promise<string | undefined> => {
    if (!name) return undefined;
  
    const normalizedName = name.replace(/\s+/g, '');
  
    const candidates = [
      `input[formcontrolname="${normalizedName}"]`,
      `input[formcontrolname="${name}"]`,
      `textarea[formcontrolname="${normalizedName}"]`,
      `textarea[formcontrolname="${name}"]`,
      `input[placeholder="${name}"]`,
      `input[name="${normalizedName}"]`,
      `input[name="${name}"]`,
      `select[formcontrolname="${normalizedName}"]`,
      `select[formcontrolname="${name}"]`,
      `input[id="${normalizedName}"]`,
      `input[id="${name}"]`,
      `span:has-text("${name}")`,
      `span:has-text("${normalizedName}")`,
      `button:has-text("${name}")`,
      `button:has-text("${normalizedName}")`,
      `div.label:has-text("${name}")`,
      `div.label:has-text("${normalizedName}")`,
      `label:has-text("${name}") + input`,
      `label:has-text("${normalizedName}") + input`,
    ];
  
    const uniqueCandidates = Array.from(new Set(candidates));
    for (const selector of uniqueCandidates) {
        try {
          await page.waitForLoadState('load');
          const elements = await page.locator(selector);
          const count = await elements.count();
      
          if (count > 0) {
            return selector;
          }
        } catch (err: any) {
          console.warn(`⚠️ Error with selector "${selector}": ${err.message}`);
        }
      }
      
    console.error("❌ No selector matched any DOM element.");
    return undefined;
  };
