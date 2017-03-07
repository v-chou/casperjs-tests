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
// Usage: casperjs test testPHSCheckElements.js --UID=your_username --PWD=your_password
// 
// ========================================================================================
var yourUsername = casper.cli.get('UID');
var createNewPHSForm = 'Create New PHS filing';
var documentStatus = '.pull-right';
var orFormsQA = 'https://or-forms-qa.ucdavis.edu/orforms/';
var FormPHS800 = 'https://or-forms-qa.ucdavis.edu/orforms/landing?tab=formPHS';
var currentPHS = 'https://or-forms-qa.ucdavis.edu/orforms/buildFormPHS';
var PHSProject = 'https://or-forms-qa.ucdavis.edu/orforms/phsProjects';
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

casper.options.viewportSize = {width: 1600, height: 1400};
casper.on('page.error', function(msg, trace) {
   this.echo('Error: ' + msg, 'ERROR');
   for(var i=0; i<trace.length; i++) {
       var step = trace[i];
       this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
   }
});

casper.test.begin('Check PHS Disclosure form UI elements', function(test) {
    casper.start(orFormsQA, function() {

      // When we open the OR Forms landing page, it get redirected to the CAS login page
      // We're waiting for the existence of the login username field before sending login info
//        casper.waitForSelector("form#fm1 input[name='username']");   
//        casper.sendLoginInfo();
         if (manualFlag === true){
            casper.waitForSelector("form#fm1 input[name='username']");     
            casper.sendLoginInfo();
        }
        test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
        casper.wait(2000, function(){
            var respon = this.status(false);
            // this.test.assertHttpStatus(302, casSecurityCheck + ' CAS security redirected');
            test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
        });
    });
    casper.thenOpen(currentPHS, function(){
    // this.wait(2000);
    
    //Top nav-bar
        this.echo('\n --- Top nav-bar tests ---');
        test.assertUrlMatch(this.getCurrentUrl(), currentPHS);
        test.assertSelectorHasText('a.navbar-brand', 'University of California Davis - Office of Research', 'Navbar to OR Forms link element found');
        test.assertSelectorHasText('a[href]', 'Project Information');
        test.assertSelectorHasText('a[href]', 'PHS Projects');
        test.assertSelectorHasText('span.white', yourUsername, 'Username found');

        this.echo('\n --- PHS Information dropdown menu tests --- ')
        //Checking for PHS Information drop-down menu is closed using the aria-expanded attribute
        test.assertEquals( this.evaluate(function(){
           return __utils__.findOne('a.dropdown-toggle').getAttribute('aria-expanded');
        }), 'false', 'PHS Information menu is closed');

          this.click('a.dropdown-toggle');
          // this.capture('dropdown.png');
          test.assertEquals(this.evaluate(function(){
              return __utils__.findOne('a.dropdown-toggle').getAttribute('aria-expanded');
          }), 'true', 'PHS Information menu is opened');


        //Breadcum nav
        this.echo('\n --- Breadcrumb tests ---');
        test.assertSelectorHasText('a[href]','Home');
        test.assertSelectorHasText('a[href]', 'Form Selection');
        test.assertSelectorHasText('li.active', 'Form PHS');

        test.assertSelectorHasText('h1.form800header', 'PHS Disclosure - Public Health Service Disclosure');
        // this.echo(this.fetchText('h1.form800header'));
        test.assertSelectorHasText('a.pull-right', 'Glossary of Terms');
        // TODO: Checking Glossary content but formatting is not straight forward thus having inconsistent results
        // test.assertSelectorHasText('h5.margin-left20 span.glossary', glossary);  
        // this.echo(this.fetchText('h5.margin-left20 span.glossary'));
        test.assertElementCount('u', 53);

        // Investigator Information section
        this.echo('\n --- Investigator Information tests ---');
        test.assertSelectorHasText('legend', 'I. Investigator Information ')
        test.assertSelectorHasText('.demographics legend', 'Investigator Information');
        // this.echo(this.fetchText('.demographics'));
        test.assertSelectorHasText('.pull-right','Draft', 'Document status string found'); 
        test.assertSelectorHasText('.demographics', 'Investigator', 'Investigator column name found');
        test.assertSelectorHasText('.demographics', 'Department Contact', 'Department Contact columnn name found');
        test.assertSelectorHasText('.demographics', 'Name:', 'Name label found');
        //TODO: Verify Name, Email and Department textboxes exists and pull text from them. currently not possible see JIRA: ORF-270
        test.assertSelectorHasText('.demographics', 'Admin Name:', 'Admin Name label found');
        test.assertExists('.admin-contact');
        test.assertSelectorHasText('.demographics', 'Email:', 'Email label found');
        test.assertSelectorHasText('.demographics', 'Admin Email:', 'Admin Email label found');
        test.assertSelectorHasText('.demographics', 'Department:', 'Department label found');
        test.assertSelectorHasText('.demographics', 'Admin Phone:', 'Admin Phone label found');
        this.echo(this.fetchText('.admin-phone-display .formatted-contact-number'));
        // var adminPhone = this.getFormValues('.formatted-contact-number');
        // this.echo('Admin Phone #:' + adminPhone);

        //Completed Training question
        this.echo('\n --- Completed Training tests ---');
        test.assertSelectorHasText('div.form-group', 'II. Training Certification')
        test.assertSelectorHasText('.help-block', CompletedTrainingQ);
        test.assertExist(
          { type: 'xpath', path: '//input[@id="completedTraining1"]'}, 
            'the "Yes" radio button element exists'
        );
        test.assertExist(
          { type: 'xpath', path: '//input[@id="completedTraining2"]'}, 
            'the "No" radio button element exists'
        );

        //Reason for disclosure section
        this.echo('\n --- Reason for Discloure tests ---');
        test.assertSelectorHasText('div.form-group', 'III. Disclosure');   
        test.assertSelectorHasText('.control-label', 'Reason for Disclosure:');

        // this.echo(this.fetchText('li #statementType1.INITIAL label'));
        // //TODO: Check label as well. can retrieve all labels using li label, but can't find a way to specify a particular one
        test.assertSelectorHasText('#statementType1', 'INITIAL');    
        test.assertSelectorHasText('#statementType2', 'MANDATORY'); 
        test.assertSelectorHasText('#statementType3', 'UPDATE'); 
        test.assertSelectorHasText('#statementType4', 'CORRECTION'); 
        this.echo('\n******** Radio button Labels **********'); 
        test.assertSelectorHasText('li label','Initial');
        test.assertSelectorHasText('li label', 'Annual update of existing Disclosure');
        test.assertSelectorHasText('li label', 'Add a new project or add a newly discovered/acquired Significant Financial Interest (SFI)');
        test.assertSelectorHasText('li label', 'Correction to existing Disclosure');      

        // Income and Equity Wizard section
        this.echo('\n --- Income & Equity Wizard tests ---');
        test.assertSelectorHasText('div.form-group', 'IV. Income and Equity');
        test.assertSelectorHasText('h3.panel-title', 'Income/Equity SFI Wizard');

        //Entity drop-down list
        test.assertSelectorHasText('span.help-block', 'Entity:');
        test.assertVisible('select#otherEntity', 'Entity drop-down list is visible');
        test.assertNotVisible('div.new-entity-div', 'Add New Entity textbox is not visible');

        //Entity Type drop-down list 
        test.assertSelectorHasText('span.help-block', 'Type of Entity:');
        test.assertVisible('select#entityType', 'Entity Type drop-down list is visible');

        casper.selectOptionByText('select[name=entityType]', 'Publicly traded entity');
        test.assertSelectorHasText('select#entityType', 'Publicly traded entity');

        casper.selectOptionByText('select[name=entityType]', 'Non-publicly traded entity');
        test.assertSelectorHasText('select#entityType', 'Non-publicly traded entity');

        test.assertExist(
          { type: 'xpath', path: '//input[@id="equityInterest1"]'}, 
            'the Equity Interest "Yes" radio button element exists'
         );
        test.assertExist(
          { type: 'xpath', path: '//input[@id="equityInterest2"]'}, 
            'the Equity Interest "No" radio button element exists'
        );

        test.assertVisible('button.determine', 'Check SFI Status button is visible');
        test.assertSelectorHasText('button.determine', 'Add SFI');

        //TODO: Need to check for table headings


        // Intellectual Property section
        this.echo('\n --- Intellectual Property tests ---');
        test.assertSelectorHasText('div.col-md-3', 'V. Intellectual Property', 'Intellectual Property label found');
        test.assertExist(
          { type: 'xpath', path: '//input[@id="ipRights1"]'}, 
            'the IP Rights "Yes" radio button element exists'
         );
        test.assertExist(
          { type: 'xpath', path: '//input[@id="ipRights2"]'}, 
            'the IP Rights "No" radio button element exists'
        );

        //TODO: Need to check for table headings

        // Travel section
        this.echo('\n --- Travel disclosure tests ---');
        test.assertSelectorHasText('div.col-md-3', 'VI. Travel', 'Travel label found');
        test.assertExist(
          { type: 'xpath', path: '//input[@id="travel1"]'}, 
            'the Travel "Yes" radio button element exists'
         );
        test.assertExist(
          { type: 'xpath', path: '//input[@id="travel2"]'}, 
            'the Travel "No" radio button element exists'
        );

        //TODO: Need to check for table headings

        // Management disclosure section
        this.echo('\n --- Management disclosure tests ---');
        test.assertSelectorHasText('div.col-md-3', 'VII. Other Outside Activity', 'Management label found');
        test.assertExist(
          { type: 'xpath', path: '//input[@id="management1"]'}, 
            'the Management "Yes" radio button element exists'
         );
        test.assertExist(
          { type: 'xpath', path: '//input[@id="management2"]'}, 
            'the Management "No" radio button element exists'
        );

        //TODO: Need to check for table headings

        //Research Project section
        this.echo('\n --- Research Project  tests ---');
        test.assertSelectorHasText('div.col-md-4', 'VIII. Research Projects (only required if a SFI was reported above.)', 'Research Project label found');
        test.assertSelectorHasText('h3.panel-title', 'Research Projects', 'Research Projects panel heading found');

        //TODO: Need to check for table headings

        test.assertSelectorHasText('a[href]', 'Manage PHS Projects', 'Found link to Projects page'); 


        //Signature box
        this.echo('\n --- Signature textbox tests ---');
        test.assertSelectorHasText('span.control-label', 'Signature', 'Signature label found');

        //TODO: Need to check for table headings

});
    casper.run(function() {
    test.done();
   });

});

