import { expect, test } from '@playwright/test';
import { MainView } from '../../page-objects/mainView';

test.describe('Basic tests for checking if main website is loaded correctly', { tag: ['@loading'] }, async () => {
  test('Checking that website is loaded correctly', async ({ page }) => {
    const mainView: MainView = new MainView(page);

    await mainView.goToMainView();
    await mainView.waitForLoadState();

    const pageStatus = await mainView.getResStatus();

    // Checking page title
    await mainView.verifyPageTitle('Portal Gov.pl'); // Assertion inside class file

    // Checking response status
    expect(pageStatus).toBe(200); // Assertion inside test file

    // Checking visibility of some elements
    await mainView.verifyFooterLogotypesDisplayed();
    await mainView.verifyLinkWithTextDisplayed('Zaloguj');
  });
});
