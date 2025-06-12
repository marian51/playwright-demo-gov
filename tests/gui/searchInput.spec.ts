import test from '@playwright/test';
import { MainView } from '../../page-objects/mainView';
import { SearchResultsView } from '../../page-objects/searchResultsView';

test.describe('Tests for checking if searching works correct', { tag: ['@search'] }, async () => {
  let mainView: MainView;
  let searchResultsView: SearchResultsView;

  test.beforeEach(async ({ page }) => {
    mainView = new MainView(page);
    searchResultsView = new SearchResultsView(page);
    await mainView.goToMainView();
  });

  test('Basic test for checking if searching works', async () => {
    await test.step('Going to main website and typing search phrase', async () => {
      await mainView.fillSearchInput('dofinansowanie');
      await mainView.clickSearchButton();
    });

    await test.step('Checking that results list is visible', async () => {
      await searchResultsView.waitForResultsLoad();

      await searchResultsView.verifyTextIsNotVisible('Nie znaleziono wyników');
      await searchResultsView.verifyElementIsNotVisible(searchResultsView.noResultsMessage);
      await searchResultsView.verifyElementIsVisible(searchResultsView.foundResultsMessage);
      await searchResultsView.verifyElementIsVisible(searchResultsView.resultsCounter);

      await searchResultsView.verifyCounterNumberIsNotZero();
    });

    await test.step('Checking that given results are displayed', async () => {
      await searchResultsView.verifyResultExistInList('Skorzystaj z programu „Mój prąd”');
      await searchResultsView.verifyResultExistInList('Dofinansowanie');
      await searchResultsView.verifyResultExistInList('Dofinansowanie MKiDN');
    });

    await test.step('Checking that some given results are not displayed', async () => {
      await searchResultsView.verifyResultNotExistInList('Reforma edukacji');
      await searchResultsView.verifyResultNotExistInList('Reforma jest niezbędna');
      await searchResultsView.verifyResultNotExistInList('Reforma planowania przestrzennego');
    });
  });

  test('Basic test for checking if filtering by "Administration unit" works correct', { tag: ['@filtering'] }, async ({ page }) => {
    await test.step('Going to main website and typing search phrase', async () => {
      await mainView.fillSearchInput('dofinansowanie');
      await mainView.clickSearchButton();
    });

    await test.step('Filter results by "Administration unit"', async () => {
      await searchResultsView.clickElementByText('Jednostka administracji');
      await searchResultsView.fillAdministrationSearchInput('Ministerstwo Klimatu i Środowiska');
      await searchResultsView.selectAdministrationUnitSearchOption('Ministerstwo Klimatu i Środowiska');
    });

    await test.step('Checking if results have only filtered administration unit', async () => {
      await page.waitForTimeout(1000);
      await searchResultsView.verifyResultsHaveAdministrationUnit('Ministerstwo Klimatu i Środowiska');
    });

    await test.step('Checking if results do not have other administration unit', async () => {
      await searchResultsView.verifyResultsDoesNotHaveAdministrationUnit('Narodowy Fundusz Ochrony Środowiska i Gospodarki Wodnej');
    });
  });

  test('Basic test for checking if filtering by "Period" works correct', { tag: ['@filtering', '@filter-period'] }, async ({ page }) => {
    await test.step('Going to main website and typing search phrase', async () => {
      await mainView.fillSearchInput('dofinansowanie');
      await mainView.clickSearchButton();
    });

    await test.step('Filter results by "Period"', async () => {
      await searchResultsView.clickElementByText('Okres');
      await searchResultsView.selectPeriodOption('Ostatnie 7 dni');
    });

    await test.step('Checking if results have only selected period', async () => {
      await page.waitForTimeout(1000);
      await searchResultsView.verifyResultsAreInPeriod('Ostatnie 7 dni');
    });

    await page.pause();
  });
});
