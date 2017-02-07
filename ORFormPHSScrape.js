var links = [];

var casper = require('casper').create({
    verbose: true,
    // logLevel: 'debug'
});



function getLinks() {
    // var links = document.querySelectorAll('h3.r a');
    var links = document.querySelectorAll('div#fphs800 tr.historyItem  a[href*="details"]');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

function getPDF() {
    // var links = document.querySelectorAll('h3.r a');
    var links = document.querySelectorAll('div#fphs800 span.margin-left5  a');
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


casper.start('file:///C:/Users/valchou/Documents/UIAutomation/phs800.html', function() {
	casper.wait(500);
	this.capture("site_image.png")
   // Wait for the page to be loaded
   // this.waitForSelector('a[href*="landing?tab=phs800"');
});

casper.then(function() {
    // aggregate results for the 'phantomjs' search
    links = this.evaluate(getLinks);
    pdf = this.evaluate(getPDF);
});

casper.run(function() {
	// require('utils').dump(this.logs);
    // echo results in some pretty fashion
    this.echo(links.length + ' links found:');
    this.echo(' - ' + links.join('\n - '))

    this.echo(pdf.length + ' PDF forms found:');
    this.echo(' + ' + pdf.join('\n + ')).exit();
});


// html body div.container-fluid div div.tab-content div#fphs800.col-md-12.phs800.tab-pane.margin-top10.active table#phsTable.table.table-striped.margin-top20.tablesorter tbody tr.historyItem td span.margin-left5 a