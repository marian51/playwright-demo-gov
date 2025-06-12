import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyPageTitle(pageTitle: string) {
    const currentPageTitle: string = await this.page.title();
    expect(currentPageTitle).toBeTruthy();
    expect(currentPageTitle).toBe(pageTitle);
  }

  async verifyTextIsNotVisible(text: string) {
    await expect(this.page.getByText(text, { exact: true })).not.toBeVisible();
  }

  async verifyElementIsVisible(element: Locator) {
    await expect(element).toBeVisible();
  }

  async verifyElementIsNotVisible(element: Locator) {
    await expect(element).toBeHidden();
  }
}
