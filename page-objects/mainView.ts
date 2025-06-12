import { expect, Locator, Page } from '@playwright/test';

export class MainView {
  private readonly page: Page;
  private readonly footerLogotypes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footerLogotypes = this.page.locator('.eu-logotypes');
  }

  async goToMainView() {
    await this.page.goto('/');
  }

  async getResStatus() {
    const response = await this.page.goto('/');
    return response?.status();
  }

  async getButtonWithText(text: string) {
    return this.page.getByRole('button', { name: text, exact: false });
  }

  async waitForLoadState() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyPageTitle(pageTitle: string) {
    const currentPageTitle: string = await this.page.title();
    expect(currentPageTitle).toBeTruthy();
    expect(currentPageTitle).toBe(pageTitle);
  }

  async verifyFooterLogotypesDisplayed() {
    await expect(this.footerLogotypes).toBeVisible();
  }

  async verifyLinkWithTextDisplayed(buttonText: string, exactText?: boolean) {
    await expect(this.page.getByRole('link', { name: buttonText, exact: exactText || false })).toBeVisible();
  }
}
