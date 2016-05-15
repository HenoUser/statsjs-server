"use strict";
const express       = require("express"),
    body            = require("body-parser"),
    Ws              = require("ws").Server,
    server          = require("http").createServer(),
    crypto          = require("crypto");

const app = express(),
    websocket = new Ws({ server : server });

/**
 * Settings
 */
app.use(body.json());
app.use(body.urlencoded({extended : true}));

// Cache sockets id
let availableSockets = {};

/**
 * Libs
 */
const mongo         = require("./libs/mongodb"),
    websocketSubs   = require("./libs/websocket-subs"),
    websocketGui    = require("./libs/websocket-gui");

/**
 * Controllers
 */
const subscriber    = require("./controllers/subscriber/subscriber.js");

/**
 * Routers
 */
// TODO(jurek) Add xhr communication with CORS
app.use("/_statsjs", subscriber);
// GUI
app.use(express.static("./public"));

// WebSocket
// TODO(jurek) Secure from undesirable connection (WS)
websocket.on("connection", (socket) => {
    // id connection
    socket.id = crypto.randomBytes(40).toString("hex");
    availableSockets[socket.id] = true;
    console.log(availableSockets);

    /**
     * @description
     * "Message" event callback
     * @params
     * message {string}
     */
    socket.on("message", (stringMessage) => {
        // TODO(jurek) Support to missed data
        let message = JSON.parse(stringMessage);
        // Selecting messages
        if (message.com) {
            switch (message.com) {
                case "getLimit":
                    websocketGui.getLimit(message, socket, availableSockets);
                    break;
            }
        } else {
            // Geo localization and init stats mongodb document
            if (!message._id && !socket._id) {
                let ip = socket.upgradeReq.headers['x-forwarded-for'] || socket.upgradeReq.connection.remoteAddress || null;
                // Geo local and ip hash
                websocketSubs.init(socket, ip, message);
            } else {
                // Remove id from message
                websocketSubs.update(socket, message);
            }
        }
    });
    // Update leave_time and
    socket.on("close", () => {
        delete availableSockets[socket.id];
        mongo.update("stats", (err) => {
            if (err) return console.warn(`Error: ${err}`);
        }, { _id : mongo.ObjectId(socket._id) }, { $set : { "time_out" : Date.now() }});
    });

    /**
     * @description
     * Statistics GUI streaming
     */

});

server.on("request", app);
server.listen(3000, () => {
    console.log(`Server listening on ${server.address().port}`);
});
