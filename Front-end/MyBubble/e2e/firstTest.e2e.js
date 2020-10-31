
describe('Login', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('show login', async () => {
    await expect(element(by.id('Google'))).toBeVisible();
  });

  it('should show login options', async () => {
    await element(by.id('Google')).tap();
  });

});
