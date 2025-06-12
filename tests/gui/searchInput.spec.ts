import test from '@playwright/test';
import { MainView } from '../../page-objects/mainView';
import { SearchResultsView } from '../../page-objects/searchResultsView';

test.describe('Tests for checking if searching and filtering works correct', { tag: ['@search'] }, async () => {
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

  test(
    'Basic test for checking if filtering by "Administration unit" works correct',
    { tag: ['@filtering', '@filter-admin-unit'] },
    async ({ page }) => {
      const searchPhrase = 'dofinansowanie';
      const filterAdministrationUnit = 'Ministerstwo Klimatu i Środowiska';

      await test.step('Going to main website and typing search phrase', async () => {
        await mainView.fillSearchInput(searchPhrase);
        await mainView.clickSearchButton();
      });

      await test.step('Filter results by "Administration unit"', async () => {
        await searchResultsView.clickElementByText('Jednostka administracji');
        await searchResultsView.fillAdministrationSearchInput(filterAdministrationUnit);
        await searchResultsView.selectAdministrationUnitSearchOption(filterAdministrationUnit);
      });

      await test.step('Checking if results have only filtered administration unit', async () => {
        await page.waitForTimeout(1000);
        await searchResultsView.verifyResultsHaveAdministrationUnit(filterAdministrationUnit);
      });

      await test.step('Checking if results do not have other administration unit', async () => {
        await searchResultsView.verifyResultsDoesNotHaveAdministrationUnit('Narodowy Fundusz Ochrony Środowiska i Gospodarki Wodnej');
      });
    },
  );

  test('Basic test for checking if filtering by "Period" works correct', { tag: ['@filtering', '@filter-period'] }, async ({ page }) => {
    const searchPhrase = 'dofinansowanie';
    const filterPeriod = 'Ostatnie 7 dni';

    await test.step('Going to main website and typing search phrase', async () => {
      await mainView.fillSearchInput(searchPhrase);
      await mainView.clickSearchButton();
    });

    await test.step('Filter results by "Period"', async () => {
      await searchResultsView.clickElementByText('Okres');
      await searchResultsView.selectPeriodOption(filterPeriod);
    });

    await test.step('Checking if results have only selected period', async () => {
      await page.waitForTimeout(1000);
      await searchResultsView.verifyResultsAreInPeriod(filterPeriod);
    });
  });

  test(
    'Basic test for checking if filtering both by "Period" and "Administration unit" works correct',
    { tag: ['@filtering', '@filter-both'] },
    async ({ page }) => {
      const searchPhrase = 'dofinansowanie';
      const filterAdministrationUnit = 'Ministerstwo Klimatu i Środowiska';
      const filterPeriod = 'Ostatni rok';

      await test.step('Going to main website and typing search phrase', async () => {
        await mainView.fillSearchInput(searchPhrase);
        await mainView.clickSearchButton();
      });

      await test.step('Filter results by "Period"', async () => {
        await searchResultsView.clickElementByText('Okres');
        await searchResultsView.selectPeriodOption(filterPeriod);
      });

      await test.step('Filter results by "Administration unit"', async () => {
        await searchResultsView.clickElementByText('Jednostka administracji');
        await searchResultsView.fillAdministrationSearchInput(filterAdministrationUnit);
        await searchResultsView.selectAdministrationUnitSearchOption(filterAdministrationUnit);
      });

      await test.step('Checking if results have only selected period', async () => {
        await page.waitForTimeout(1000);
        await searchResultsView.verifyCounterNumberIsNotZero();
        await searchResultsView.verifyResultsAreInPeriod(filterPeriod);
      });

      await test.step('Checking if results have only filtered administration unit', async () => {
        await searchResultsView.verifyResultsHaveAdministrationUnit(filterAdministrationUnit);
      });

      await test.step('Checking if results do not have other administration unit', async () => {
        await searchResultsView.verifyResultsDoesNotHaveAdministrationUnit('Narodowy Fundusz Ochrony Środowiska i Gospodarki Wodnej');
      });
    },
  );
});
