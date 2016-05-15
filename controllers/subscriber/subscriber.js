"use strict";
const router    = require("express").Router(),
    statsjsIp   = require("../../libs/statsjs-ip.js"),
    mongo       = require("../../libs/mongodb");

const orgin = "*";

router.options("/", (req, res) => {
    res.header('Access-Control-Allow-Origin', orgin)
        .header("Access-Control-Allow-Headers", "X-Api-Key, Content-Type")
        .header("Access-Control-Allow-Methods", "POST")
        .status(200).send();
});

router.post("/", (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || "not supported";
    statsjsIp.save(ip, (err, _id) => {
        if (err) return console.warn(`Error: ${err}`);
        // Add taken stats to db
        mongo.update("stats", (err) => {
            if (err) return console.warn(`Error: ${err}`);
            res.header('Access-Control-Allow-Origin', orgin)
                .status(200).send({ _id : _id });
        }, { _id : mongo.ObjectId(_id) }, { $set : req.body });
    });
});

router.options("/:id", (req, res) => {
    res.header('Access-Control-Allow-Origin', orgin)
        .header("Access-Control-Allow-Headers", "X-Api-Key, Content-Type")
        .header("Access-Control-Allow-Methods", "POST")
        .status(200).send();
});

router.post("/:id", (req, res) => {
    mongo.update("stats", (err) => {
        if (err) return console.warn(`Error: ${err}`);
        res.header('Access-Control-Allow-Origin', orgin)
            .status(200).send();
    }, { _id : mongo.ObjectId(req.params.id) }, { $set : req.body });
});

module.exports = router;