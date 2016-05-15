const mongo     = require("./mongodb"),
    statsjsIp   = require("./statsjs-ip.js");

/**
 * @description
 * Initialize function that create document in database per session
 * Add ip location, ip hash and stats (without: history, time_out)
 * @param socket
 * @param ip
 * @param message
 */
function _statsInitSession(socket, ip, message) {
    "use strict";
    // Geo local and ip hash
    statsjsIp.save(ip, (err, _id) => {
        if (err) return console.warn(`Error: ${err}`);
        // Add id to socket
        socket._id = _id;
        // Add taken stats to db
        mongo.update("stats", (err) => {
            if (err) return console.warn(`Error: ${err}`);
            socket.send(JSON.stringify({ _id : _id }));
        }, { _id : mongo.ObjectId(_id) }, { $set : message });
    });
}

/**
 * @description
 * Update session document with history and time_out
 * @param socket
 * @param message
 * @private
 */
function _statsUpdateSession(socket, message) {
    "use strict";
    // Remove id from message
    delete message._id;
    mongo.update("stats", (err) => {
        if (err) return console.warn(`Error: ${err}`);
    }, { _id : mongo.ObjectId(socket._id) }, { $set : message });
}

module.exports = {
    init : _statsInitSession,
    update : _statsUpdateSession
};