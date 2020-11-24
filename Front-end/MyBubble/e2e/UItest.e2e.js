/**
 * Test changing users health status
 * Note: Requires user to manually login first within 20 seconds
 */
const { strict } = require('assert');
const { performance } = require('perf_hooks');
describe('UI Test', () => {

    beforeAll(async () => {
        await waitFor(element(by.id('add'))).toBeVisible().withTimeout(15000);
      });

    
    it('Go to search screen', async () => {
      await expect(element(by.id('add'))).toBeVisible();
      await element(by.id('add')).tap();
    });

    //Add non-existent user
    var t0;
    var t1;
    it('Add non-existent user', async () => {
      
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Alex");
      await element(by.id('search')).tapReturnKey();
      t0 = performance.now();
      await expect(element(by.text("Not Found"))).toBeVisible();
      t1 = performance.now();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      //await(t1-t0<2000);
      var timetook = t1-t0;
      var assert = require('assert');
      try{
      assert(timetook < 4000, "Took too long");
      console.log("PASSED: time to get non-existent user " + timetook.toString());
      }catch(e){
        console.log("FAILED:timing to get user name for non-existent user took too long "+ timetook.toString());
      }

    });
   

    //Add invalid name numbers
    it('Add numbers', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("123");
      await element(by.id('search')).tapReturnKey();
      t0 = performance.now();
      await expect(element(by.text("Please enter a valid name"))).toBeVisible();
      t1 = performance.now();
      await element(by.text('OK')).tap();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      var timetook = t1-t0;
      var assert = require('assert');
      try{
      assert(timetook < 4000, "Took too long");
      console.log("PASSED: time to get bad search input " + timetook.toString());
      }catch(e){
        console.log("FAILED:timing to get bad search input took too long "+ timetook.toString());
      }

    });

    //Add invalid name symbols
    it('Add Symbols', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("@hello$");
      await element(by.id('search')).tapReturnKey();
      t0 = performance.now();
      await expect(element(by.text("Please enter a valid name"))).toBeVisible();
      t1 = performance.now();
      await element(by.text('OK')).tap();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      await element(by.id('search')).tapBackspaceKey();
      var timetook = t1-t0;
      var assert = require('assert');
      try{
      assert(timetook < 4000, "Took too long");
      console.log("PASSED: time to get bad search input " + timetook.toString());
      }catch(e){
        console.log("FAILED:timing to get bad search input took too long "+ timetook.toString());
      }
    });
  
    //Add existing user
    it('Add existing user', async () => {
      await expect(element(by.id('search'))).toBeVisible();
      await element(by.id('search')).tap();
      await element(by.id('search')).typeText("Dan");
      await element(by.id('search')).tapReturnKey();
      t0 = performance.now();
      await expect(element(by.text("Dan"))).toBeVisible();
      t1 = performance.now();
      await element(by.text("Dan Gheesling")).tap();
      await expect(element(by.text("You added a new connection"))).toBeVisible();
      await element(by.text('OK')).tap();
      var timetook = t1-t0;
      var assert = require('assert');
      try{
      assert(timetook < 4000, "Took too long");
      console.log("PASSED: time to get existent user " + timetook.toString());
      }catch(e){
        console.log("FAILED:timing to get user name for existent user took too long "+ timetook.toString());
      }

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
      t0 = performance.now();
      await expect(element(by.text("Kanye East"))).toBeVisible();
      t1 = performance.now();
      await element(by.text("Kanye East")).tap();
      await expect(element(by.text("You added a new connection"))).toBeVisible();
      await element(by.text('OK')).tap();
      var timetook = t1-t0;
      var assert = require('assert');
      try{
      assert(timetook < 4000, "Took too long");
      console.log("PASSED: time to get existent user " + timetook.toString());
      }catch(e){
        console.log("FAILED:timing to get user name for existent user took too long "+ timetook.toString());
      }

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
      await element(by.text("18")).tap();
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
      await element(by.id('search')).typeText("Super");
      await element(by.id('search')).tapReturnKey();
      await expect(element(by.text("Super Mario"))).toBeVisible();
      await element(by.text("Super Mario")).tap();
      await expect(element(by.text("You added a new temporary connection"))).toBeVisible();
      await element(by.text('OK')).tap();
      await element(by.text("18")).tap();
      await expect(element(by.text("Super Mario"))).toBeVisible();
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
    });
  
  });
  