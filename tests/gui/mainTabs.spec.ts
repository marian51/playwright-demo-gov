import test from '@playwright/test';
import { MainView } from '../../page-objects/mainView';

test.describe('Basic tests for checking visibility of the tabs in the main view', { tag: ['@tabs'] }, async () => {
  let mainView: MainView;

  test.beforeEach(async ({ page }) => {
    mainView = new MainView(page);
    await mainView.goToMainView();
  });

  [{ tabName: 'Dla Obywatela' }, { tabName: 'Dla Przedsiębiorcy' }, { tabName: 'Dla Urzędnika' }, { tabName: 'Dla Rolnika' }].forEach(
    ({ tabName }) => {
      test(`Checking of visibility the "${tabName}" tab`, async () => {
        await test.step(`Going to '${tabName}' tab`, async () => {
          await mainView.clickOnMainTab(tabName);
        });

        await test.step(`Checking elements in '${tabName}' tab`, async () => {
          await mainView.verifyTabElementsAreDisplayed(tabName);
        });
      });
    },
  );
});
