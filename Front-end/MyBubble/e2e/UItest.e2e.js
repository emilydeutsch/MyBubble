/**
 * Test changing users health status
 * Note: Requires user to manually login first within 20 seconds
 */
describe('UI Test', () => {

    beforeAll(async () => {
        await waitFor(element(by.id('add'))).toBeVisible().withTimeout(15000);
      });

    
    it('Go to search screen', async () => {
      await expect(element(by.id('add'))).toBeVisible();
      await element(by.id('add')).tap();
    });

    //Add non-existent user
    it('Add non-existent user', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Alex");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Not Found"))).toBeVisible();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
    });

    //Add invalid name numbers
    it('Add numbers', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("123");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Please enter a valid name"))).toBeVisible();
      await element(by.text('OK')).tap();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
    });

    //Add invalid name symbols
    it('Add Symbols', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("@hello$");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Please enter a valid name"))).toBeVisible();
      await element(by.text('OK')).tap();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
    });
  
    //Add existing user
    it('Add existing user', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Dan");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Dan"))).toBeVisible();
      await element(by.text("Dan Gheesling")).tap();
      await expect(element(by.text("You added a new connection"))).toBeVisible();
      await element(by.text('OK')).tap();
    });

    //Return to search
    it('Go to search screen', async () => {
      await expect(element(by.id('add'))).toBeVisible();
      await element(by.id('add')).tap();
    });

    //Add existing user in list
    it('Add existing user in list', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Kanye");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Kanye East"))).toBeVisible();
      await element(by.text("Kanye East")).tap();
      await expect(element(by.text("You added a new connection"))).toBeVisible();
      await element(by.text('OK')).tap();
    });
  
    //Change health status
    it('Go to settings screen', async () => {
      await element(by.text('Settings')).tap();
    });
  
    it('Change health status', async () => {
      await expect(element(by.text('healthy'))).toBeVisible();
      await element(by.text('healthy')).tap();
      await expect(element(by.text("covid"))).toBeVisible();
      await element(by.text("covid")).tap();
      await expect(element(by.text("You changed your health status"))).toBeVisible();
      await element(by.text('OK')).tap();
    });

    //Add temporary connection
    it('Go to calendar', async () => {
      await element(by.text('Calendar')).tap();
    });

    it('Add Temporary Connection', async () => {
      await expect(element(by.id('add_tmp'))).toBeVisible();
      await element(by.text("19")).tap();
      await element(by.id('add_tmp')).tap();
    });

    //Test temporary connections search

    //Add non-existent user
    it('Add temporary non-existent user', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Alex");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Not Found"))).toBeVisible();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
    });

    //Add invalid name numbers
    it('Add temporary numbers', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("123");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Please enter a valid name"))).toBeVisible();
      await element(by.text('OK')).tap();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
    });

    //Add invalid name symbols
    it('Add temporary Symbols', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("@hello$");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Please enter a valid name"))).toBeVisible();
      await element(by.text('OK')).tap();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
    });

    //Add existing user in list
    it('Add temporary existing user', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Hank");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Hank Hill"))).toBeVisible();
      await element(by.text("Hank Hill")).tap();
      await expect(element(by.text("You added a new temporary connection"))).toBeVisible();
      await element(by.text('OK')).tap();
      await element(by.text("19")).tap();
      await expect(element(by.text("Hank Hill"))).toBeVisible();
    });

    //Change health status again
    it('Go to settings screen', async () => {
      await element(by.text('Settings')).tap();
    });
  
    it('Change health status', async () => {
      await expect(element(by.text('covid'))).toBeVisible();
      await element(by.text('covid')).tap();
      await expect(element(by.text("healthy"))).toBeVisible();
      await element(by.text("healthy")).tap();
      await expect(element(by.text("You changed your health status"))).toBeVisible();
      await element(by.text('OK')).tap();
    });

    //Return to home screen
    it('Go to home screen', async () => {
      await element(by.text('Home')).tap();
      await expect(element(by.id('add'))).toBeVisible();
    });
  
  });
  