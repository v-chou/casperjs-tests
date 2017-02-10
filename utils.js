// ======================================================================================
// Utility functions 
// 
// Author: Val Chou
// 
// 
// 
// 
// 
// 
// Revision: 0.01 (07/05/2016)
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