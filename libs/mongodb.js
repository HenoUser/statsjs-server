"use strict";

// Dependencies
var mongodb = require("mongodb");

// Config / libs
var mongoConf   = require("../config/db"),
    errorHandle = require("./error"),
    // Database handle
    dbHandle = null;

/**
 * MongoDB connection
 */
try {
    mongodb.connect("mongodb://"+mongoConf.user+":"+mongoConf.pass+"@"+mongoConf.host+":"+mongoConf.port+"/"+mongoConf.db, function(err, database) {
        if (err) {
            errorHandle.emit("log", {id : 101, message : err});
        } else {
            console.log("Database connected!\n");
            dbHandle = database;
        }
    });
} catch (err) {
    errorHandle.emit("log", {id : 102, message : "Cannot find 'mongoConf' configuration or wrong structure!"});
}

/**
 * @description
 * Function finding data
 *
 * @param collection {string}
 * @param call {function}
 * @param query [optional (if not == full collection)] {object}
 * @param options [optional (if not == full collection)] {object}
 * @returns {function} with parameters:
 *  1)Error code(if perform)
 *  2)NULL value by expected data(or data)
 */
function find(collection, call, query, options) {
    // Catch error if call is not function
    if (typeof call !== "function" || (typeof collection !== "string")) {
        errorHandle.emit("log", {id : 103, message : "'call' argument is not function ("+typeof call+") or 'collection' is not string ("+collection+")"});
        return call(103, null);
    }
    // Catch error if dbHandle is invalid
    if (!dbHandle) {
        errorHandle.emit("log", {id : 104, message : "Cannot find dbHandler ("+dbHandle+")"});
        return call(104, null);
    }
    // Make query
    dbHandle.collection(collection).find(query, options).toArray(function(err, arrayData) {
        if (err) {
            errorHandle.emit("log", {id : 105, message : err});
            return call(105, null);
        }
        return call(null, arrayData);
    });
}

/**
 * @description
 * Function inserting data to collection
 *
 * @param collection {string}
 * @param call {function}
 * @param arrayOfQuery {Array}
 * @returns {function} with parameters:
 *  1)Error code(if perform)
 *  2)NULL value by expected data(or data)
 */
function insert(collection, call, arrayOfQuery) {
    // Closure for error 113a
    var _arrayOfQueryError;
    // Catch error if call is not function
    if (typeof call !== "function" || (typeof collection !== "string") || (!Array.isArray(arrayOfQuery))) {
        errorHandle.emit("log", {id : 113, message : "'call' argument is not function ("+typeof call+") or 'collection' is not string ("+collection+") or 'arrayOfQuery' is not array ("+arrayOfQuery+")"});
        return call(113, null);
    }
    // Catch error if element of arrayOfQuery is not object
    arrayOfQuery.forEach(function(elem, index) {
        if (typeof elem !== "object" || elem === null) {
            if (_arrayOfQueryError) {
                _arrayOfQueryError += "["+index+':'+elem+"("+typeof elem+")]";
            } else {
                _arrayOfQueryError = "["+index+':'+elem+"("+typeof elem+")]";
            }
        }
    });
    if (_arrayOfQueryError) {
        errorHandle.emit("log", {id : "113a", message : "'arrayOfQuery' error [index : field(type)]: "+_arrayOfQueryError});
        return call("113a", null)
    }
    // Catch error if dbHandle is invalid
    if (!dbHandle) {
        errorHandle.emit("log", {id : 114, message : "Cannot find dbHandler ("+dbHandle+")"});
        return call(114, null);
    }
    // Make query
    dbHandle.collection(collection).insertMany(arrayOfQuery, function(err, result) {
        if (err) {
            errorHandle.emit("log", {id : 115, message : err});
            return call(115, null);
        }
        call(null, result.ops);
    });
}

/**
 * @description
 * Function updating multi document in collection
 *
 * @param collection {string}
 * @param call {function}
 * @param filter {object}
 * @param update {object}
 * @returns {function} with parameters:
 *  1)Error code(if perform)
 *  2)NULL value by expected data(or data)
 */
function updateMulti(collection, call, filter, update) {
    // Catch error if call is not function
    if (typeof call !== "function" || (typeof collection !== "string") || (typeof filter !== "object" || filter === null) || (typeof update !== "object" || update === null)) {
        errorHandle.emit("log", {id : 123, message : "'call' argument is not function ("+typeof call+") or 'collection' is not string ("+collection+") or 'filter', 'update' is not object ("+filter+", "+update+")"});
        return call(123, null);
    }
    // Catch error if dbHandle is invalid
    if (!dbHandle) {
        errorHandle.emit("log", {id : 124, message : "Cannot find dbHandler ("+dbHandle+")"});
        return call(124, null);
    }
    // Make query
    dbHandle.collection(collection).updateMany(filter, update, function(err, info) {
        if (err) {
            errorHandle.emit("log", {id : 125, message : err});
            return call(125, null);
        }
        call(null, info.result);
    });
}

/**
 * @description
 * Function deleting documents
 *
 * @param collection {string}
 * @param call {function}
 * @param filter {object}
 * @returns {function} with parameters:
 *  1)Error code(if perform)
 *  2)NULL value by expected data(or data)
 */
function deleteMany(collection, call, filter) {
    // Catch error if call is not function
    if (typeof call !== "function" || (typeof collection !== "string") || (typeof filter !== "object" || filter === null)) {
        errorHandle.emit("log", {id : 133, message : "'call' argument is not function ("+typeof call+") or 'collection' is not string ("+collection+") or 'filter' is not object ("+filter+")"});
        return call(133, null);
    }
    // Catch error if dbHandle is invalid
    if (!dbHandle) {
        errorHandle.emit("log", {id : 134, message : "Cannot find dbHandler ("+dbHandle+")"});
        return call(134, null);
    }
    // Make query
    dbHandle.collection(collection).deleteMany(filter, function(err, info) {
        if (err) {
            errorHandle.emit("log", {id : 135, message : err});
            return call(135, null);
        }
        call(null, info.result);
    });
}

module.exports = {
    find : find,
    insert : insert,
    update : updateMulti,
    remove : deleteMany,
    ObjectId : mongodb.ObjectId
};



