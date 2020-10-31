const detox = require('detox');
const config = require('../package.json').detox;

describe('Login', () => {
  beforeEach(async () => {
    await detox.init(config);
    await device.reloadReactNative();
  });

  it('show login', async () => {
    await expect(element(by.id('Google'))).toBeVisible();
  });

  it('should login and add connection', async () => {
    await element(by.id('Google')).tap();
    await expect(element(by.id('add'))).toBeVisible();
  });

  it('show search screen', async () => {
    await expect(element(by.id('search'))).toBeVisible();
  });

  afterAll(async () => {
    await detox.cleanup();
  });
});
