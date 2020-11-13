/**
 * Test adding an not existing user
 */
describe('Login', () => {

    beforeAll(async () => {
        //await device.reloadReactNative();
        await waitFor(element(by.id('add'))).toBeVisible().withTimeout(15000);
      });
  
    it('Go to search screen', async () => {
      await expect(element(by.id('add'))).toBeVisible();
      await element(by.id('add')).tap();
    });
  
    it('Add non-existing user', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Brandon");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Not Found"))).toBeVisible();
    });
  
  });
  