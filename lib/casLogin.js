// ======================================================================================
// UC Davis CAS login  
// 
// Author: Val Chou
// 
// User will send username and password via CLI 
// Script was created via ResurrectIO casperJS recorder
// 
// Usage: casperjs test testCase.js --UID=your_username --PWD=your_password
// 
// Revision: 0.01 (07/05/2016)
// 
// ======================================================================================

casper.sendLoginInfo = function(){
  var yourUsername = casper.cli.get('UID');
  var yourPassword = casper.cli.get('PWD');
 

   casper.wait(500, function(){
    
    this.fill('form#fm1', {
        'username' : yourUsername,
        'password' : yourPassword
    }, true);
    this.capture("./images/loginPage.png");
  });

  //
  //No need to check every field as we're not testing the LOGIN form. Code below is now deprecated
  //
  //
   // casper.waitForSelector("input[name='username']",
   //     function success() {
   //         this.sendKeys("input[name='username']", yourUsername);
   //         // this.capture('001username.png');
   //     },
   //     function fail() {
   //         test.assertExists("input[name='username']");
   // });
   // casper.waitForSelector("input[name='password']",
   //     function success() {
   //         this.sendKeys("input[name='password']", yourPassword + "\r");
   //         this.capture('001.pwd.png');
   //     },           
   //     function fail() {
   //         test.assertExists("input[name='password']");
   // });
   // casper.waitForSelector("form#fm1 input[type=submit][value='LOGIN']",
   //     function success() {
   //        //Following line only works inside the casper test modules
   //         // test.assertExists("form#fm1 input[type=submit][value='LOGIN']");
   //         this.click("form#fm1 input[type=submit][value='LOGIN']");
   //     },
   //     function fail() {
   //         test.assertExists("form#fm1 input[type=submit][value='LOGIN']");
   // });
};