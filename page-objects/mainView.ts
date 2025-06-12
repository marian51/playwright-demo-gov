import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class MainView extends BasePage {
  private readonly footerLogotypes: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.footerLogotypes = this.page.locator('.eu-logotypes');
    this.searchInput = this.page.locator('#query');
    this.searchButton = this.page.locator('//form/button');
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

  async fillSearchInput(searchText: string) {
    await this.searchInput.fill(searchText);
  }

  async clickSearchButton() {
    await this.searchButton.click();
  }

  async verifyFooterLogotypesDisplayed() {
    await expect(this.footerLogotypes).toBeVisible();
  }

  async verifyLinkWithTextDisplayed(buttonText: string, exactText?: boolean) {
    await expect(this.page.getByRole('link', { name: buttonText, exact: exactText || false })).toBeVisible();
  }
}
