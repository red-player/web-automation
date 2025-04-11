import { Page } from 'playwright';
import { performActionOnElement } from './pageUtils';

type NavigationLevels = Partial<{
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
  seventh : string
  eighth : string
  ninth : string
  tenth : string
}>;

export const navigateSidebarMenu = async (
  page: Page,
  levels: NavigationLevels,
  timeout = 2000
) => {
  const orderedKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth','seventh' ,'eighth','ninth','tenth'];

  for (const key of orderedKeys) {
    const label = levels[key as keyof NavigationLevels];
    if (!label) continue;

    console.log(`Navigating to: ${label}`);

    await performActionOnElement(page, {
      action: 'click',
      selector: `span:has-text("${label}")`,
      waitOptions: { state: 'visible', timeout }
    });
  }
}



