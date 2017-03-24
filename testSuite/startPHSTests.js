// ========================================================================================
// File: Sets appropriate paths to correct utils and property files and logins into system 
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


casper.test.begin('Start of PHS Test Suite', function(test) {
	casper.start(orFormsQA, function() {
		casper.waitForSelector("form#fm1 input[name='username']");
		casper.sendLoginInfo();
		test.assertUrlMatch(this.getCurrentUrl(), orFormsQA);
	});

	casper.wait(2000), function() {
		var response = this.status(false);
		this.echo('response: ' + response);
	}

	casper.run(function() {
		test.done();
	});

});

