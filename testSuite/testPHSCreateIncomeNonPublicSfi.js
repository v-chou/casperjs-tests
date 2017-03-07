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
// Usage: casperjs test testPHSIncomeSFICreation.js --UID=your_username --PWD=your_password --OPT=Yes
// 
// ========================================================================================
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');
var manualFlag = casper.cli.get('MAN');
var x = require('casper').selectXPath;

if (manualFlag === true){
    casper.echo('selected manual testing mode, enabling proper path to properties and helper scripts');
     phantom.injectJs('../lib/casLogin.js');
     phantom.injectJs('../lib/utils.js');
     phantom.injectJs('../properties/or-tests.properties');
} 
phantom.injectJs('./lib/casLogin.js');
phantom.injectJs('./lib/utils.js');
phantom.injectJs('./properties/or-tests.properties');

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

casper.test.begin('Create Non-Public Income SFI', function(test) {
    casper.start(orFormsQA, function() {

    // When we open the OR Forms landing page, it get redirected to the CAS login page
    // We're waiting for the existence of the login username field before sending login info
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
    casper.thenOpen(currentPHS, function(){
        this.wait(500);
        this.test.assertHttpStatus(200, orFormsQA + ' is up');
    // In order to submit a completed PHS disclosure form, an associated project must be entered/completed
    // We will first complete the project information page.    
        if(this.visible('.project-required')){
            this.echo('No Project information found adding project information');
            this.click('a.dropdown-toggle');
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
        this.echo('At least one project has been created... continuing with PHS form');
    // casper.then(function(){

      

      this.echo('\n--- Filling out PHS Form ---'); 

      casper.selectOptionByText('#otherEntity.control-form','CDC');
      casper.selectOptionByText('#entityType.control-form','Non-publicly traded entity');
      test.assertNotVisible('span.no-sfi',noSfi, 'No SFI message not displayed');

      this.fillSelectors('form.phs-form', {
            'input[name="statementType"]': 'CORRECTION',
            'input[name="toolIncome"]':'5001',
            'input[name="ipRights"]': 'NO',
            'input[name="travel"]': 'NO',
            'input[name="management"]': 'NO',
            'input[name="signature"]': 'signed by CasperJS script on: '+ mydigits
      }, false);
      
      this.capture('./images/noNonPublicIncomeModal.png');
      this.echo('======= clicking on Add SFI button ===========')
      this.clickLabel('Add SFI', 'button');
      //this.capture('./images/nonPublicIncomeModal.png');
      this.waitUntilVisible('#nonPublicModal', function(){
            test.assertVisible('h3#nonPublicModalLabel','SFI Disclosure for Non-Publicly Traded Entity');
            this.echo(this.fetchText('#nonPublicEquity'));
            this.fillSelectors('form.sfi-np-modal', {
                  'select[name="npRelationship"]': 'SELF',
                  'input[name="npConsulting"]': '501',
                  'input[name="npDividends"]': '500',
                  'input[name="npHonoraria"]': '500',
                  'input[name="npAuthorship"]': '500',
                  'input[name="npInKind"]': '250',
                  'input[name="npDiem"]': '250',
                  'input[name="npSalary"]': '2000',
                  'input[name="npStipend"]': '250',
                  'input[name="npOther"]': 'laboratory items',
                  'input[name="npOtherAmount"]': '250',
                  'textarea[name="npEntityPurpose"]': 'Inserted by CasperJS on: ' + mystring + '. ' + text2202chars,
                  'input[name="npSfiRelated"]': 'YES',
                  'textarea[name="npStatement"]': 'Inserted by CasperJS on: ' + mystring + '. ' + text2202chars
            }, true);
            this.capture('./images/modalNonPublicIncomeComplete.png');
      });    

});

       casper.run(function() {
        test.done();
       });

});

