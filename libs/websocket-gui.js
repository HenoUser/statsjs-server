const mongo     = require("./mongodb"),
    error       = require("./error");

function _getLimit(message, socket, availableSockets) {
    "use strict";
    mongo.find("statsjs", (err, result) => {
        let i = 0;
        while(i < message.limit) {
            if (!result[i] || !availableSockets[socket.id]) {
                i = 0;
                break;
            } else {
                try {
                    socket.send(JSON.stringify(result[i]));
                    i++;
                } catch (e) {
                    error.emit("log", { id : 200, message : e.message });
                    i = 0;
                    break;
                }
            }
        }
    }, null, { limit : message.limit , skip : message.start , sort : { "time_in" : -1 }});
}

module.exports = {
    getLimit : _getLimit
};