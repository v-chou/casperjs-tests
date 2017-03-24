// ========================================================================================
// File: Verification of Error messages on the Intellectual Property Rights modal dialog.
// 
// Asserts all available UI elements on page
// 
// Uses the PhantomJS and CasperJS libraries
// Author: Val Chou
// Date: September 6, 2016
// Last Revised: February 1, 2017
// 
// Usage: casperjs test testPHSIPRightsModalError.js --UID=your_username --PWD=your_password --OPT=Yes
// 
// ========================================================================================
var utils = require('utils');
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');
var amountIncome = '5001';
var amountEquity = 0;
var createNewPHSForm = 'Create New PHS filing';
var x = require('casper').selectXPath;
var manualFlag = casper.cli.get('MAN');

if (manualFlag === true){
    casper.echo('Selected manual testing mode, enabling proper path to properties and helper scripts');
    // Uncomment this section if you need to run the script outside of the suite
     phantom.injectJs('../lib/casLogin.js');
     phantom.injectJs('../lib/utils.js');
     phantom.injectJs('../properties/or-tests.properties');
} 
phantom.injectJs('./lib/casLogin.js');
phantom.injectJs('./lib/utils.js');
phantom.injectJs('./properties/or-tests.properties');
//********************************************
//set browser user agent
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
casper.options.viewportSize = {width: 1600, height: 1400};
casper.on('page.error', function(msg, trace) {
   this.echo('Error: ' + msg, 'ERROR');
   for(var i=0; i<trace.length; i++) {
       var step = trace[i];
       this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
   }
});

casper.test.begin('Checking error messages on intellectual rights sfi modal window', function(test) {
    casper.start(orFormsQA, function() {
    // When we open the OR Forms landing page, it get redirected to the CAS login page
    // We're waiting for the existence of the login username field before sending login info
    // --------------------------------------------------------------------------------
    // The following 2 lines are not needed when script is part of a suite
    // casper.waitForSelector("form#fm1 input[name='username']");  
    // casper.sendLoginInfo();
    //-----------------------------------------------------------------------------------
    test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
    // --------------------------------------------------------------------------------
    // Sends login info when executing the script manually (not part of a test suite);
    if (manualFlag === true){
        casper.waitForSelector("form#fm1 input[name='username']");     
        casper.sendLoginInfo();
    }
    //-----------------------------------------------------------------------------------
 });
   // clientScripts:['ms-qa.ucdavis.edu/orforms/resources/js/bootstrap.combined.min.js']
    casper.wait(2000, function(){
           var respon = this.status(false);
        // this.test.assertHttpStatus(302, casSecurityCheck + ' CAS security redirected');

    });
    casper.thenOpen(currentPHS, function(){
    this.wait(500);
    this.test.assertHttpStatus(200, orFormsQA + ' is up');
    // this.echo('==================');
    // this.echo(futureDate);
    // In order to submit a completed PHS disclosure form, an associated project must be entered/completed
    // We will first complete the project information page.    
    if(this.visible('.project-required')){
        this.echo('Running Add project information');
        this.click('a.dropdown-toggle');
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
                'textarea[name="describeResearch"]': 'Filling describe research textbox on: ' + mystring,
                'input[name="beginDate"]': todaysDate,
                'input[name="endDate"]': futureDate
            }, true);
            // this.capture('projFill2.png');
        });

        this.waitForSelector('.col-md-12 a[href*="buildFormPHS"]', function(){
            test.assertVisible('.col-md-12 a[href*="buildFormPHS"]','Go to Draft Disclosure link found');
            this.clickLabel('Go to Draft Disclosure', 'a');
        });
    } 
    this.echo('Continuting with PHS form');
    this.echo('\n--- Filling out incomde modal form ---'); 
    casper.selectOptionByText('#otherEntity.control-form','Acrobat');
    casper.selectOptionByText('#entityType.control-form','Publicly traded entity');
    test.assertNotVisible('span.no-sfi',noSfi, 'No SFI message not displayed');
      
    this.capture('./images/noModal.png');
    this.echo('======= clicking on IP Rights Add SFI button ===========')
    this.click('input#ipRights1');

    this.waitUntilVisible('button.rights-btn', function(){
        test.assertVisible('button.rights-btn');
        this.click('button.rights-btn');
    });
    // test.assertNotVisible('span.no-sfi', noSfi, 'No SFI message found');
    this.waitUntilVisible('#rightsModal', function(){
          
        test.assertSelectorHasText('h3#rightsModalLabel','SFI Disclosure for Intellectual Property Rights');
        // Hitting submit to generate expected errors:
        // this.click('button.submit-ip-modal');
        this.clickLabel('Submit', 'button');
        test.assertSelectorHasText('.ip-entity-error','You must select or add an entity.');
        test.assertSelectorHasText('.ip-amount-error', 'You must indicate the total amount received from this entity.');
        test.assertSelectorHasText('.ip-relationship-error','You must indicate an individual to whom the interest applies.');
        test.assertSelectorHasText('.ip-description-error','This question requires an answer.');
        test.assertSelectorHasText('.ip-reasonable-error','This question requires an answer.');
        test.assertSelectorHasText('.ip-statement-error','This question requires an answer.');

    });
    // this.wait(1000, function(){
    //     this.capture('./images/modalIPErrors.png');
    //     utils.dump(this.getElementInfo('#rightsModal .submit-ip-modal'));
    // });    

    
});

    casper.run(function() {
        test.done();
    });

});

