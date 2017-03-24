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
// Usage: casperjs test startPHSTests.js --MAN=true|false --UID=your_username --PWD=your_password --OPT=YES|NO
// 
// ========================================================================================
var utils = require('utils');
var x = require('casper').selectXPath;
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');
var manualFlag = casper.cli.get('MAN');

if (manualFlag === true){
    //********************************************
    casper.echo('Selected manual testing mode, enabling proper path to properties and helper scripts');
     phantom.injectJs('../lib/casLogin.js');
     phantom.injectJs('../lib/utils.js');
     phantom.injectJs('../properties/or-tests.properties');
    //*********************************************
} 

//********************************************
// Uncomment this section if you need to run this script as part of the suite
phantom.injectJs('./lib/casLogin.js');
phantom.injectJs('./lib/utils.js');
phantom.injectJs('./properties/or-tests.properties');
//********************************************

casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0');
casper.options.viewportSize = {width: 1600, height: 1400};

casper.test.begin('Public Income Modal element check', function(test) {
	casper.start(orFormsQA, function() {
	    if (manualFlag === true){
	         casper.waitForSelector("form#fm1 input[name='username']");     
	         casper.sendLoginInfo();
    }
		test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
	});

	casper.wait(2000), function() {
		var response = this.status(false);
		this.echo('response: ' + response);
	}

	casper.thenOpen(currentPHS, function(){
		this.test.assertHttpStatus(200,orFormsQA + ' is up!');
	
		casper.selectOptionByValue('#otherEntity','1');		//selects second option on the list provided an entity has been created
	    var optionText = casper.getSelectedOption('#otherEntity');
	    
    	casper.selectOptionByText('#entityType', 'Publicly traded entity');

		this.sendKeys("input[name='toolIncome']", '0');
		this.click('#equityInterest1');
		this.sendKeys("input[name='toolEquity']", '5001')
		// this.wait(1000);
		// this.capture('./images/equityFill.png')
		this.clickLabel('Add SFI','button');

		this.waitUntilVisible('#publicModal', function(){
			test.assertVisible('h3#publicModalLabel','SFI Disclosure for Publicly Traded Entity');
			test.assertSelectorHasText('.form-group span', 'Entity:');
			var pubEntity = this.fetchText('.public-entity');
			test.assertEquals(optionText, pubEntity, 'selected Entity "' + pubEntity + '" match');
			test.assertSelectorHasText('.form-group span', 'Type of Entity:');

			var pubTypeEntity = this.fetchText('.public-entity-type');
			var optionText2 = casper.getSelectedOption('#entityType');
			test.assertEquals( pubTypeEntity, optionText2, 'selected type of entity: "' + optionText2 + '" match');
			// this.echo(this.fetchText('div.form-group .help-block .glossary'));

			test.assertEquals(incomeZero, this.fetchText('#publicIncome'), 'Expected income amount of: '+incomeZero+ ' matches');
			test.assertEquals(equity5001, this.fetchText('#publicEquity'), 'Expected equity amount of: ' + equity5001+ ' matches');
			test.assertSelectorHasText('.form-group span', 'Individual(s) who received and/or holds equity interest:');
			var relationshipType = casper.getSelectedOption('#relationship');
			test.assertEquals(relationshipType, 'Select', 'Dropdown list has: "'+relationshipType+'" as item selected');

			test.assertVisible('.form-group span', 'Purpose of Income label is visible');
			test.assertNotVisible('div.income-categories td', 'Consulting label not visible');
			test.assertNotVisible('div.income-categories td', 'Distribution/Dividends label is not visible');
			test.assertNotVisible('div.income-categories td', 'Honoraria table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Paid Authorship table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Payment in Kind table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Per Diem table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Salary table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Stipend table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Other table label is not visible');
			test.assertNotVisible('div.income-categories td', 'Amount table label is not visible');
			// test.assertExists('.submit-modal', 'Submit button found');
			test.assertNotVisible('#pb-delete', 'Delete button not displayed');
			test.assertVisible('#publicModal .submit-modal', 'Submit button is visible');
			// utils.dump(this.getElementInfo('#publicModal .submit-modal'));
			// utils.dump(this.getElementInfo('.sfi-modal button:nth-child(1)'));
			// utils.dump(this.getElementInfo('#np-delete'));
		});	
		
	});

	casper.run(function() {
		test.done();
	});

});

//<span for="statementType" class="col-md-6 help-block" style="padding-top: 0px;"><span class="glossary"><u>INCOME</u> related to your <u>INSTITUTIONAL RESPONSIBILITIES</u> received by you or an <u>IMMEDIATE FAMILY MEMBER</u> in <strong><span class="current-entity">Addding</span></strong> within the last 12 months:</span></span>