// ========================================================================================
// File: PHS Non Public Modal window UI Check
// 
// Uses the PhantomJS and CasperJS libraries
// Author: Val Chou
// Date: September 6, 2016
// Last Revised: January 5, 2017
// 
// Usage: casperjs test testPHSCheckElementIncomeModalNonPub.js --MAN=true|false --OPT=YES|NO
// --UID=your_username --PWD=your_password 
// 
// ========================================================================================
var utils = require('utils');
var x = require('casper').selectXPath;
var yourUsername = casper.cli.get('UID');
var yesNoOption = casper.cli.get('OPT');
var manualFlag = casper.cli.get('MAN');

if (manualFlag === true){
    casper.echo('Selected manual testing mode, enabling proper path to properties and helper scripts');
     phantom.injectJs('../lib/casLogin.js');
     phantom.injectJs('../lib/utils.js');
     phantom.injectJs('../properties/or-tests.properties');
} 
phantom.injectJs('./lib/casLogin.js');
phantom.injectJs('./lib/utils.js');
phantom.injectJs('./properties/or-tests.properties');

casper.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0');
casper.options.viewportSize = {width: 1600, height: 1400};

casper.test.begin('UI Element checks on non-public modal', function(test) {
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
	    
    	casper.selectOptionByText('#entityType', 'Non-publicly traded entity');

		this.sendKeys("input[name='toolIncome']", income5001);
		this.clickLabel('Add SFI','button');

		this.waitUntilVisible('#nonPublicModal', function(){
			test.assertVisible('h3#nonPublicModalLabel','SFI Disclosure for Non-Publicly Traded Entity');
		
			test.assertSelectorHasText('.form-group span', 'Entity:');
			var npEntity = this.fetchText('.np-entity');
			this.wait(1000);
			this.capture('./images/nonPubModal.png');
			test.assertEquals(optionText, npEntity, 'selected Entity "' + npEntity + '" match');
			test.assertSelectorHasText('.form-group span', 'Type of Entity:');

			var npTypeEntityModal = this.fetchText('.np-entity-type');
			var optionText2 = casper.getSelectedOption('#entityType');
			test.assertEquals( npTypeEntityModal, optionText2, 'selected type of entity: "' + optionText2 + '" match');
			// // this.echo(this.fetchText('div.form-group .help-block .glossary'));

			test.assertEquals(income5001, this.fetchText('#nonPublicIncome'), 'Expected income amount of: '+income5001+ ' matches');
			// // test.assertEquals(equityZero, this.fetchText('#publicEquity'), 'Expected equity amount of: ' + equityZero+ ' matches');
			test.assertSelectorHasText('.form-group span', 'Individual(s) who received and/or holds equity interest:');
			var npRelationshipType = casper.getSelectedOption('#npRelationship');
			test.assertEquals(npRelationshipType, 'Select', 'Dropdown list has: "'+npRelationshipType+'" as item selected');

			test.assertSelectorHasText('.form-group span', 'Purpose of Income');
			test.assertSelectorHasText('div.np-income-categories td', 'Consulting');
			test.assertVisible('#npConsulting', 'Consulting field is visible')

			test.assertSelectorHasText('div.np-income-categories td', 'Distribution/Dividends');
			test.assertVisible('#npDividends', 'Distribution/Dividends field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Honoraria');
			test.assertVisible('#npHonoraria', 'Honoraria field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Paid Authorship');
			test.assertVisible('#npAuthorship', 'Authorship field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Payment in Kind');
			test.assertVisible('#npInKind', 'Payment in Kind field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Per Diem');
			test.assertVisible('#npDiem', 'Per Diem field is visible'); 

			test.assertSelectorHasText('div.np-income-categories td', 'Salary');
			test.assertVisible('#npSalary', 'Salary field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Stipend');
			test.assertVisible('#npStipend', 'Stipend field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Other');
			test.assertVisible('#npOther', 'Other text field is visible');

			test.assertSelectorHasText('div.np-income-categories td', 'Amount');
			test.assertVisible('#npOtherAmount', 'Amount field is visible');

			test.assertVisible('.submit-np-modal', 'Submit button visible');
			test.assertNotVisible('#pb-delete', 'Delete button not displayed');
				// utils.dump(this.getElementInfo('#nonPublicModal .submit-np-modal'));
				// utils.dump(this.getElementInfo('#nonPublicModal div:nth-child(17) button:nth-child(1)'));

		});	
		// test.assertVisible('button.btn.btn-primary.submit-np-modal');
		// utils.dump(this.getElementInfo('#np-delete'));

// #publicModal > div > div > div.modal-body > form > div:nth-child(16) > div > button.btn.btn-primary.submit-modal
// #publicModal > div > div > div.modal-body > form > div:nth-child(16) > div > button:nth-child(1)
// #np-delete
// #nonPublicModal > div > div > div.modal-body > form > div:nth-child(17) > div > button.btn.btn-primary.submit-np-modal
// #nonPublicModal > div > div > div.modal-body > form > div:nth-child(17) > div > button:nth-child(1)
	});


	casper.run(function() {
		test.done();
	});

});

