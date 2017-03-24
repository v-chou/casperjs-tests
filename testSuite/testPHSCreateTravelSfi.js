// ========================================================================================
// File: Verification of UI elements on the new PHS-800 form.
// 
// Asserts all available UI elements on page
// 
// Uses the PhantomJS and CasperJS libraries
// Author: Val Chou
// Date: September 6, 2016
// Last Revised: January 5, 2017
// 
// Usage: casperjs test testPHSCreateTravelSfi.js --UID=your_username --PWD=your_password --OPT=Yes
// 
// ========================================================================================
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');
var createNewPHSForm = 'Create New PHS filing';
var currentPHSTemp = 'https://or-forms-qa.ucdavis.edu/orforms/detailsPHS?formId=11794';
var x = require('casper').selectXPath;
var manualFlag = casper.cli.get('MAN');

if (manualFlag === true){
    //********************************************
    casper.echo('Selected manual testing mode, enabling proper path to properties and helper scripts');
     phantom.injectJs('../lib/casLogin.js');
     phantom.injectJs('../lib/utils.js');
     phantom.injectJs('../properties/or-tests.properties');
    //*********************************************
} 
//set browser user agent
// casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
casper.options.viewportSize = {width: 1600, height: 1400};
casper.on('page.error', function(msg, trace) {
    this.echo('Error: ' + msg, 'ERROR');
    for(var i=0; i<trace.length; i++) {
        var step = trace[i];
        this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
});

casper.test.begin('Create a Travel SFI test', function(test) {
   casper.start(orFormsQA, function() {

    // When we open the OR Forms landing page, it get redirected to the CAS login page
    // We're waiting for the existence of the login username field before sending login info
    // --------------------------------------------------------------------------------
    // Sends login info when executing the script manually (not part of a test suite);
    if (manualFlag === true){
         casper.waitForSelector("form#fm1 input[name='username']");     
         casper.sendLoginInfo();
    }
    //-----------------------------------------------------------------------------------

   test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
   
 });
   // clientScripts:['ms-qa.ucdavis.edu/orforms/resources/js/bootstrap.combined.min.js']
   casper.wait(2000, function(){
    var respon = this.status(false);
    // this.test.assertHttpStatus(302, casSecurityCheck + ' CAS security redirected');
  });
  casper.clear();
  phantom.clearCookies();

  casper.thenOpen(currentPHSTemp, function(){
    this.wait(500);
    this.test.assertHttpStatus(200, orFormsQA + ' is up');
    // this.echo('==================');
    // this.echo(futureDate);
// In order to submit a completed PHS disclosure form, an associated project must be entered/completed
// We will first complete the project information page.    
    if(this.visible('.project-required')){
      this.echo('Running Add project information');
      this.click('a.dropdown-toggle');
      // this.capture('clickmenu.png');
      // this.echo(this.fetchText('.dropdown-menu'));
      this.clickLabel('PHS Projects', 'a');

      this.waitForSelector('a.add-phs-project', function() {
        test.assertVisible('a.add-phs-project');
           
        test.assertUrlMatch(this.getCurrentUrl(), PHSProject);
        this.click('.add-phs-project');
        this.echo('\n--- Filling out PHS Project Information form ---');

        casper.selectOptionByText('#projectRole', 'Consultant');
        casper.selectOptionByText('#fundingEntity', 'National Institutes of Health (NIH)');
        this.fillSelectors('form.project-form', {
          'input[name="title"]': 'Automation ' + mystring,
          'input[name="subawardEntityName"]': 'subward-automation ' + mystring,
          'input[name="involveHumanSubjects"]': yesNoOption,
          'input[name="proposalSponsorAwardNumber"]': 'SponsorAward ' + mydigits,
          'input[name="irbNumber"]': 'IRB#' + shortDigits,
          'textarea[name="describeResearch"]': 'Filling describe research textbox on: ' + mystring + " " + text2202chars,
          'input[name="beginDate"]': todaysDate,
          'input[name="endDate"]': futureDate
        }, true);
        // this.capture('projFill2.png');
      });

      this.waitForSelector('.col-md-12 a[href*="buildFormPHS"]', function(){
        test.assertVisible('.col-md-12 a[href*="buildFormPHS"]','Go to Draft Disclosure link found');
        this.clickLabel('Go to Draft Disclosure', 'a');
      });
    } else {
        this.echo('Continuting with PHS form');
    }
      // Disabling the IP Rights add SFI button
      this.click('input#ipRights2');
      this.click('input#travel1');  
      this.capture('./images/noTravelModal.png');
      this.echo('======= clicking on Enter Rquired SFI button ===========');
    
      this.waitUntilVisible('button.travel-btn', function(){
          test.assertVisible('button.travel-btn');
          this.click('button.travel-btn');
      });
      
    
      /*
        Waits for the modal dialog to appear then fill the necessary fields
      */
     this.echo('======= Travel modal window visible ===========');
     this.waitUntilVisible('#travelModal', function(){
            this.wait(1000, function(){
              // Waiting for modal to render
              test.assertVisible('h3#travelModalLabel','SFI Disclosure for Travel');
                this.capture('./images/travelModal.png');
            });
        // Filling form 
        this.fillSelectors('.sfi-travel-modal', {
          'select[name="travelEntityId"]': 'Coruscant Foundation',
          'input[name="travelLocation"]': 'Paris, France',
          'textarea[name="travelReason"]': 'Travel Reason Comments entered here by CasperJS automation on: ' + mydigits,
          'input[name="travelSfiRelated"]': yesNoOption,
          'textarea[name="travelStatement"]': 'Travel Statement Comments entered here by CasperJS automation on: ' + mydigits        
        }, false);

         this.sendKeys("input[name='beginDate']", "09/25/2016");
         this.sendKeys("input[name='endDate']", "10/05/2016");

         this.wait(1000, function(){
              this.capture('./images/travelsficomplete.png');
              this.click("form .btn.btn-primary.submit-travel-modal");
         });
    });
 
      this.capture('./images/afterModal.png');
});

   casper.run(function() {
    test.done();
   });

});

