"use strict";

/**
 * 
 * Currently planning on building this as a local web server. I think that will be easier to use. Generates the mindmap from an upload directly in the browser.
 * 
 */

module.exports = function JSONtoMindmap(jsObject, parentDocumentElement) {

    return new Promise((resolve, reject)=> {
        if(typeof jsObject != "object") {
            reject('Parameter jsObject must be a javascript object');
        }
        else {
            console.log('This was succesfully exported!')
            console.log(jsObject);
        }

    });
};

