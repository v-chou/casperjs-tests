// ========================================================================================
// File: Verification of UI elements on the new PHS-800 form.
// 
// Asserts all available UI elements on page
// 
// Uses the PhantomJS and CasperJS libraries
// Author: Val Chou
// Created: January 10, 2017
// Last Revised: 
// 
// Usage: casperjs test testPHSProjectCheckElements.js --UID=your_username --PWD=your_password --verbose --log-level=debug
// 
// ========================================================================================
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');
var formLabel = 'span.control-label';
var x = require('casper').selectXPath;
var manualFlag = casper.cli.get('MAN');

if (manualFlag === true){
    casper.echo('selected manual testing mode, enabling proper path to properties and helper scripts');
    // Uncomment this section if you need to run the script outside of the suite
     phantom.injectJs('../lib/casLogin.js');
     phantom.injectJs('../lib/utils.js');
     phantom.injectJs('../properties/or-tests.properties');
} 
phantom.injectJs('./lib/casLogin.js');
phantom.injectJs('./lib/utils.js');
phantom.injectJs('./properties/or-tests.properties');


casper.options.viewportSize = {width: 1600, height: 1400};
casper.on('page.error', function(msg, trace) {
   this.echo('Error: ' + msg, 'ERROR');
   for(var i=0; i<trace.length; i++) {
       var step = trace[i];
       this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
   }
});

casper.test.begin('Check Project Information page UI elements', function(test){
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
	      
	      casper.wait(2000, function(){
	          var respon = this.status(false);
	          // this.test.assertHttpStatus(302, casSecurityCheck + ' CAS security redirected');
	          // this.test.assertHttpStatus(200, orFormsQA + ' is up');
	          test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
	      });
	});

    casper.thenOpen(PHSProject, function(){
    	this.test.assertHttpStatus(200, PHSProject + ' is up');
		this.wait(500);
		// this.echo(this.getCurrentUrl());
    	test.assertUrlMatch(this.getCurrentUrl(), 'getCurrentURL matches');
    	this.echo('\n *** PHS Project page tests *** ');
    	this.capture('./images/phsscreenshot.png');
	    test.assertSelectorHasText('li.active', 'Project Information', 'Project Information page displayed');
	    // this.echo(this.fetchText('div.margin-bottom10 span.boldish'));
	    test.assertSelectorHasText('div.margin-bottom10 span.boldish',phsProjNote, 'Project Note found');
	    test.assertSelectorHasText('div.margin-bottom10 a[href]', 'PHS Sponsors or agencies that adopted PHS regulations', 'Exempted Government agency list link found');
	    test.assertSelectorHasText('.add-phs-project', '+ Add new project', 'Add new project form link found');
	    test.assertSelectorHasText('.col-md-12 a[href]', 'Create or Return to Draft Disclosure', 'Back to PHS disclosure link found');

	   
	    this.echo('\n--- New Project Information --- ');
	    this.click('.add-phs-project');
	    // if there are no projects entered on this page the follwoing applies. TO DO: Need conditional here.
	    // test.assertSelectorHasText('.table td span', 'No active projects identified.', 'Project Information is empty');
	    //TODO: Table headings check 
	    //
	    test.assertSelectorHasText(formLabel, 'Project Title', 'Project Title label found');
	    // test.assertSelectorHasText('input#title placeholder', 'Project Title', 'Project Title texbox found');
	    test.assertExist('input#title', 'Project Title textbox found');
	    test.assertSelectorHasText(formLabel, 'Project Role', 'Project Role label found');
	    
	    // Testing dropdown list selection then checking actual selection 
	    casper.selectOptionByText('select#projectRole', 'Consultant');
	    this.capture('./images/consultant.png');
	    test.assertSelectorHasText(formLabel, 'Agency', 'Agency label found');
	    
	    // Testing dropdown list selection then checking actual selection 
	    // this.echo(this.fetchText('select#fundingEntity'));
	    // this.capture('agencyPre.png');
	    casper.selectOptionByText('#fundingEntity', 'National Institutes of Health (NIH)\n');
	    this.capture('./images/agencyPost.png');
	    // 
	    test.assertSelectorHasText(formLabel, 'Subaward Entity Name(if applicable)', 'Subaward label found');
	    test.assertVisible('input#subawardEntityName', 'Subaward Entity text box found\n');
	    
	    test.assertSelectorHasText('div.form-group', 'Human Subjects', 'Human Subjects label found');
	    test.assertVisible('input#involveHumanSubjects1', 'Human Subjects "Yes" radio button found');
	    test.assertVisible('input#involveHumanSubjects2', 'Human Subjects "No" radio button found\n');

	    test.assertSelectorHasText(formLabel, 'Status of Project: Proposal, JIT, Award. Include SPO #', 'Status of Project label found');
	    test.assertVisible('input#proposalSponsorAwardNumber', 'Award # textbox found\n');

	    test.assertSelectorHasText(formLabel, 'IRB Number(if applicable)', 'IRB Number label found');
	    test.assertVisible('input#irbNumber', 'IRB Number textbox found\n');

	    test.assertSelectorHasText(formLabel, 'Describe Research', 'Research Description label found');
	    test.assertVisible('textarea#describeResearch', 'Describe Research textbox found\n');

	    test.assertSelectorHasText(formLabel, 'Project Start', 'Project Start label found');
	    test.assertSelectorHasText(formLabel, 'Project End','Project End label found');
	    test.assertVisible('input#beginDate', 'Begin Date input field found');
	    test.assertVisible('input#endDate', 'End Date input field found\n');
	    // this.echo('-------------');
	    // this.echo(this.fetchText('span.control-label'));
	    // require('utils').dump(casper.getElementInfo('select#projectRole').text);
	    // 
	    test.assertSelectorHasText('button.cancel', 'Cancel', 'Cancel button found');
	    test.assertSelectorHasText('button.add-project', 'Add Project', 'Add Project button found');
	    
	    test.assertSelectorHasText('div.margin-top20', phsProjFooter, 'PHS Project page footer found');
	});

   casper.run(function() {
    test.done();
   });
});