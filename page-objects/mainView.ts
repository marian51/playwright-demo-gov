import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import mainTabsValues from '../resources/mainTabsValues.json';

export class MainView extends BasePage {
  private readonly footerLogotypes: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  private mainTab: Locator;
  private tabElementsLocator: Locator;
  private elementLocator: Locator;
  private tabsIdsMap: Map<string, string>;

  constructor(page: Page) {
    super(page);
    this.footerLogotypes = this.page.locator('.eu-logotypes');
    this.searchInput = this.page.locator('#query');
    this.searchButton = this.page.locator('//form/button');

    this.tabsIdsMap = new Map<string, string>();
    this.tabsIdsMap.set('Dla Obywatela', 'services-citizens');
    this.tabsIdsMap.set('Dla Przedsiębiorcy', 'services-business');
    this.tabsIdsMap.set('Dla Urzędnika', 'services-officials');
    this.tabsIdsMap.set('Dla Rolnika', 'services-farmer');
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

  async clickOnMainTab(tabName: string) {
    this.mainTab = this.page.getByRole('tab', { name: tabName });
    await this.mainTab.click();
  }

  async verifyFooterLogotypesDisplayed() {
    await expect(this.footerLogotypes).toBeVisible();
  }

  async verifyLinkWithTextDisplayed(buttonText: string, exactText?: boolean) {
    await expect(this.page.getByRole('link', { name: buttonText, exact: exactText || false })).toBeVisible();
  }

  async verifyTabElementsAreDisplayed(givenTabName: string) {
    const tabId = this.tabsIdsMap.get(givenTabName) ?? '';
    this.tabElementsLocator = this.page.locator('#' + tabId);

    await expect(this.tabElementsLocator).toBeVisible();

    const tabElements = await this.tabElementsLocator.locator('//ul/li/a/span').allTextContents();
    const expectedValues = mainTabsValues.find((element) => element.tabName === givenTabName)?.elements ?? [];

    for (const element of expectedValues) {
      expect(tabElements).toContain(element);

      this.elementLocator = this.tabElementsLocator.getByText(element, { exact: true });
      await expect(this.elementLocator).toBeVisible();
    }
  }
}
