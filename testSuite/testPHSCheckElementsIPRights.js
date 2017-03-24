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
// Usage: casperjs test testPHSCheckElementsIPRights.js --UID=your_username --PWD=your_password --OPT=Yes
// 
// ========================================================================================
var utils = require('utils');
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');

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

casper.test.begin('Checking UI Elements in the IP Rights modal window', function(test) {
    casper.start(orFormsQA, function() {
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
    this.echo('======= clicking on IP Rights Add SFI button ===========')
    this.click('input#ipRights1');      //Clicking on the Yes radio button to enable the Enter Rquire SFI button

    this.waitUntilVisible('button.rights-btn', function(){
        test.assertVisible('button.rights-btn');
        this.click('button.rights-btn');
    });
    // test.assertNotVisible('span.no-sfi', noSfi, 'No SFI message found');
    this.waitUntilVisible('#rightsModal', function(){
          
        test.assertSelectorHasText('h3#rightsModalLabel','SFI Disclosure for Intellectual Property Rights');

        test.assertSelectorHasText('span.col-md-6', 'Entity:');
        var ipEntityOption = casper.getSelectedOption('#ipEntity');
        test.assertEquals(ipEntityOption, 'Select', 'Dropdown option: "' + ipEntityOption + '" matches');

        test.assertSelectorHasText('span.col-md-6', 'Total amount received from this entity:');
        var ipAmountRcv = casper.getSelectedOption('#ipPayment');
        test.assertEquals(ipAmountRcv, 'Select', 'Dropdown option: "' + ipAmountRcv + '" matches');

        test.assertSelectorHasText('span.col-md-6', 'Individual(s) who received payment:');
        var ipPayment = casper.getSelectedOption('#ipRelationship');
        test.assertEquals(ipPayment, 'Select', 'Dropdown option: "' + ipPayment + '" matches');

        test.assertVisible('textarea#ipDescription', 'Text area for description is visible');
        // utils.dump(this.getElementsInfo('#ipSfiRelated1'));
        test.assertVisible('input#ipSfiRelated1', '"Yes" radio button is visible');
        test.assertVisible('input#ipSfiRelated2', '"No" radio button is visible');
        test.assertVisible('textarea#ipStatement', 'Text area for statement is visible');

        test.assertVisible('.submit-ip-modal', '"Submit" button is visible');
        test.assertVisible('.submit-ip-modal-repeat', '"Submit and enter another" button is visible');
        test.assertVisible('.cancel', '"Cancel" button is visible');
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

