// ======================================================================================
// Utility functions 
// 
// Author: Val Chou
//  
// Revision: 0.02 (02/14/2017)
// 
// ======================================================================================


//Selects drop-down option by text option (rather by id) and sends a change event in case it's needed
//Authored by stackoverflow contributor: ArtjomB
casper.selectOptionByText = function(selector, textToMatch){
    this.evaluate(function(selector, textToMatch){
        var select = document.querySelector(selector),
            found = false;
        Array.prototype.forEach.call(select.children, function(opt, i){
            if (!found && opt.innerHTML.indexOf(textToMatch) !== -1) {
                select.selectedIndex = i;
                found = true;
            }
        });
        // dispatch change event in case there is some kind of validation
        var evt = document.createEvent("UIEvents"); // or "HTMLEvents"
        evt.initUIEvent("change", true, true);
        select.dispatchEvent(evt);
    }, selector, textToMatch);
};

//Selects drop-down option by text the dropdown value and sends a change event 
//Authored by stackoverflow contributor: ArtjomB
casper.selectOptionByValue = function(selector, valueToMatch){
    this.evaluate(function(selector, valueToMatch){
        var select = document.querySelector(selector),
            found = false;
        Array.prototype.forEach.call(select.children, function(opt, i){
            if (!found && opt.value.indexOf(valueToMatch) !== -1) {
                select.selectedIndex = i;
                found = true;
            }
        });
        // dispatch change event in case there is some kind of validation
        var evt = document.createEvent("UIEvents"); // or "HTMLEvents"
        evt.initUIEvent("change", true, true);
        select.dispatchEvent(evt);
    }, selector, valueToMatch);
};


casper.createNewEntity = function(newEntityName) {
    casper.selectOptionByText('#otherEntity', 'Create new..');
    this.sendKeys('#newEntity',newEntityName);
    this.wait(500, function(){
        this.click('.add-entity');
    });
    this.waitForSelectorTextChange('#otherEntity', function(){
    // this.capture('../images/afterCreateEntity.png');
        casper.test.assertSelectorHasText('#otherEntity', newEntityName);
    });        
};

//Returns text of the dropdown item
//Authored by stackoverflow contributor: ArtjomB
//Source: http://tinyurl.com/hup52u2
//
//Slightly modified by Val Chou to return the selector for validation
casper.getSelectedOption = function(selector) {
    var selected = this.evaluate(function(selector){
        var s = document.querySelector(selector);
        var o = s.children[s.selectedIndex];
     // return {value: o.value, text: o.innerHTML};
        return o.innerHTML;
    }, selector);
    // this.echo("result: " + JSON.stringify(selected, undefined, 4));
    // this.echo(selected);
    return selected;
}

// This iterates over the nth td or th in all the rows and writes 
// the value of the innerText property into a result array
// 
// Authored by stackoverflow contributor: ArtjomB
// Source: http://tinyurl.com/jnfdfbf 
casper.tableColumnText = function(tableSelector, columnNumber, withHeader, merged){
    // columnNumber starts with 1
    var texts = this.evaluate(function(tableSelector, columnNumber, withHeader){
        var headerFields = document.querySelectorAll(tableSelector + " > thead > tr > th:nth-child("+columnNumber+")"),
            bodyFields = document.querySelectorAll(tableSelector + " > tbody > tr > td:nth-child("+columnNumber+")"),
            result = [];
        if (withHeader) {
            Array.prototype.forEach.call(headerFields, function(headerField){
                result.push(headerField.innerText);
            });
        }
        Array.prototype.forEach.call(bodyFields, function(bodyField){
            // result.push(bodyField.innerText);
            // this.console(bodyField);
            result.push(bodyField.innerHTML);
        });
        return result;
    }, tableSelector, columnNumber, withHeader);
    if (merged) {
        return texts.join(' ');
    }
    return texts;
};


casper.getDraftDocumentLink = function(tableSelector, columnNumber) {
    // columnNumber starts with 1
    draftLink = this.evaluate(function(tableSelector, columnNumber) { 
       var link = document.querySelectorAll(tableSelector + " > tbody > tr >  td:nth-child("+columnNumber+")");
       Array.prototype.map.call
   });

};