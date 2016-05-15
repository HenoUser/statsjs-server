var EventEmitter    = require('events').EventEmitter;

var error = new EventEmitter();

/**
 * Error handler for logger
 */
error.on('log', function(errObj) {

    // Self error catching
    if (!errObj) console.error("'ERROR HANDLER': Cannot find 'errObj'");
    if (!errObj.id) console.error("'ERROR HANDLER': Cannot find 'errObj.id'");
    if (!errObj.message) console.error("'ERROR HANDLER': Cannot find 'errObj.message'");

    if (errObj && errObj.id && errObj.message) console.error("Error("+errObj.id+"): "+errObj.message+"\n");
    console.trace();
    console.log("\n");

});

module.exports = error;