"use strict"

var Connection = require('./client/connection.js');
var WebSocket = typeof WebSocket == 'undefined' ? require('ws') : WebSocket;

module.exports = {
    Server: require('./server'),
    Connect: function (host, port, cb) {
        var ws = new WebSocket(['ws://', host, ':', port].join(''));

        var conn = new Connection({
            ws: ws,
        });

        ws.onopen = function () {
            cb(conn);
        }

        // TODO: disconnection error handling

        // ws.onclose = function(e) {
        // };

        // ws.onerror = function(error) {
        // };
    }
};