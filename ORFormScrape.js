var links = [];

var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});



function getLinks() {
    // var links = document.querySelectorAll('h3.r a');
    var links = document.querySelectorAll('div  a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

// casper.start('http://google.fr/', function() {
//    // Wait for the page to be loaded
//    this.waitForSelector('form[action="/search"]');
// });

// casper.then(function() {
//    // search for 'casperjs' from google form
//    this.fill('form[action="/search"]', { q: 'casperjs' }, true);
// });


casper.start('file:///C:/Users/valchou/Documents/UIAutomation/orformsLanding.html', function() {
	casper.wait(500);
	this.capture("site_image.png")
   // Wait for the page to be loaded
   // this.waitForSelector('a[href*="landing?tab=phs800"');
});

casper.then(function() {
    // aggregate results for the 'phantomjs' search
    links = this.evaluate(getLinks);
});

casper.run(function() {
	// require('utils').dump(this.logs);
    // echo results in some pretty fashion
    this.echo(links.length + ' links found:');
    this.echo(' - ' + links.join('\n - ')).exit();
});

// .\38 00 > a:nth-child(1)
// .coi > a:nth-child(1)