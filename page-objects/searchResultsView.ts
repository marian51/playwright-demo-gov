import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class SearchResultsView extends BasePage {
  readonly noResultsMessage: Locator;
  readonly foundResultsMessage: Locator;
  readonly resultsCounter: Locator;
  readonly resultsList: Locator;

  private readonly administrationUnitSearchInput: Locator;

  private administrationUnitSearchOption: Locator;

  constructor(page: Page) {
    super(page);
    this.noResultsMessage = this.page.locator('.search__empty-state');
    this.foundResultsMessage = this.page.locator('.search-results');
    this.resultsCounter = this.page.locator('.search__counter');
    this.resultsList = this.page.locator('//*[contains(@class, "search-results__list result-list")]');

    this.administrationUnitSearchInput = this.page.locator('#custom-select-ministryid-dropdown').getByRole('textbox', { name: 'szukaj...' });
  }

  async waitForResultsLoad() {
    await this.resultsList.waitFor();
  }

  async fillAdministrationSearchInput(givenText: string) {
    await this.administrationUnitSearchInput.fill(givenText);
  }

  async selectAdministrationUnitSearchOption(optionText: string) {
    this.administrationUnitSearchOption = this.page.getByRole('option', { name: optionText });
    await this.administrationUnitSearchOption.click();
  }

  async verifyCounterNumberIsNotZero() {
    const counterNumber = parseInt((await this.resultsCounter.allInnerTexts())[0].split(': ')[1]);
    expect(counterNumber).toBeGreaterThan(0);
  }

  async verifyResultExistInList(givenText: string) {
    const resultsTexts = await this.resultsList.locator('//ul/li//a').allTextContents();
    const exist = resultsTexts.some((text) => text === givenText);
    expect(exist).toBeTruthy();
  }

  async verifyResultNotExistInList(givenText: string) {
    const resultsTexts = await this.resultsList.locator('//ul/li//a').allTextContents();
    const exist = resultsTexts.some((text) => text === givenText);
    expect(exist).toBeFalsy();
  }

  async verifyResultsHaveAdministrationUnit(administrationUnit: string) {
    const resultsUnits = await this.resultsList.locator('//ul/li/span').allTextContents();
    resultsUnits.forEach((unit) => {
      const cleanedUnit = unit.split('/ ')[1].trim();
      expect(cleanedUnit).toBe(administrationUnit.trim());
    });
  }

  async verifyResultsDoesNotHaveAdministrationUnit(administrationUnit: string) {
    const resultsUnits = await this.resultsList.locator('//ul/li/span').allTextContents();
    resultsUnits.forEach((unit) => {
      const cleanedUnit = unit.split('/ ')[1].trim();
      expect(cleanedUnit).not.toBe(administrationUnit.trim());
    });
  }
}
