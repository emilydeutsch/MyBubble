/**
 * Test changing users health status
 * Note: User must be healthy first
 */
describe('Login', () => {

    beforeAll(async () => {
        //await device.reloadReactNative();
        await waitFor(element(by.id('add'))).toBeVisible().withTimeout(15000);
      });
  
  
    it('Go to settings screen', async () => {
      await expect(element(by.id('add'))).toBeVisible();
      await element(by.text('Settings')).tap();
    });
  
    it('Change health status', async () => {
      await expect(element(by.text('healthy'))).toBeVisible();
      await element(by.text('healthy')).tap();
      await expect(element(by.text("covid"))).toBeVisible();
      await element(by.text("covid")).tap();
      await expect(element(by.text("You changed your health status"))).toBeVisible();
    });
  
  });
  