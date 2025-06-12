import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class SearchResultsView extends BasePage {
  readonly noResultsMessage: Locator;
  readonly foundResultsMessage: Locator;
  readonly resultsCounter: Locator;
  readonly resultsList: Locator;

  private readonly administrationUnitSearchInput: Locator;

  private filteringOption: Locator;
  private periods: Map<string, number>;

  constructor(page: Page) {
    super(page);
    this.noResultsMessage = this.page.locator('.search__empty-state');
    this.foundResultsMessage = this.page.locator('.search-results');
    this.resultsCounter = this.page.locator('.search__counter');
    this.resultsList = this.page.locator('//*[contains(@class, "search-results__list result-list")]');

    this.administrationUnitSearchInput = this.page.locator('#custom-select-ministryid-dropdown').getByRole('textbox', { name: 'szukaj...' });

    this.periods = new Map<string, number>();
    this.periods.set('Ostatni rok', 365);
    this.periods.set('Ostatnie 30 dni', 30);
    this.periods.set('Ostatnie 7 dni', 7);
    this.periods.set('Ostatnie 90 dni', 90);
  }

  async waitForResultsLoad() {
    await this.resultsList.waitFor();
  }

  async fillAdministrationSearchInput(givenText: string) {
    await this.administrationUnitSearchInput.fill(givenText);
  }

  async selectAdministrationUnitSearchOption(optionText: string) {
    this.filteringOption = this.page.getByRole('option', { name: optionText });
    await this.filteringOption.click();
  }

  async selectPeriodOption(optionText: string) {
    this.filteringOption = this.page.locator('#custom-select-period-dropdown').getByText(optionText);
    await this.filteringOption.click();
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

  async verifyResultsAreInPeriod(givenPeriod: string) {
    let daysPeriod = this.periods.get(givenPeriod) ?? 0;
    daysPeriod = daysPeriod * 24 * 60 * 60 * 1000;
    const resultsUnits = await this.resultsList.locator('//ul/li/span').allTextContents();
    resultsUnits.forEach((unit) => {
      const dateString = unit.split('/ ')[0].trim();
      const [month, day, year] = dateString.split('/').map(Number);
      const date = new Date(year, month - 1, day + 1);
      const dateToday = new Date();

      expect(date.getTime()).toBeGreaterThan(dateToday.getTime() - daysPeriod);
    });
  }
}
