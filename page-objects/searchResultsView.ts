import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class SearchResultsView extends BasePage {
  readonly noResultsMessage: Locator;
  readonly foundResultsMessage: Locator;
  readonly resultsCounter: Locator;
  readonly resultsList: Locator;

  constructor(page: Page) {
    super(page);
    this.noResultsMessage = this.page.locator('.search__empty-state');
    this.foundResultsMessage = this.page.locator('.search-results');
    this.resultsCounter = this.page.locator('.search__counter');
    this.resultsList = this.page.locator('//*[contains(@class, "search-results__list result-list")]');
  }

  async waitForResultsLoad() {
    await this.resultsList.waitFor();
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
}
