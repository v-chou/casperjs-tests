// ========================================================================================
// File: PHS template
// 
// Uses the PhantomJS and CasperJS libraries
// Author: Val Chou
// Date: September 6, 2016
// Last Revised: January 5, 2017
// 
// Usage: casperjs test testPHSTemplate.js --MAN=true|false --OPT=YES|NO
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

casper.test.begin('Create a Travel SFI', function(test) {
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

	casper.run(function() {
		test.done();
	});

});

