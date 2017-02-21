const WebSocket = require('ws');
const TcpConnection = require('./protocol/tcp.js');
const UdpConnection = require('./protocol/udp.js');
const HttpConnection = require('./protocol/http.js');

class Connection {
    constructor(params) {
        this.callbacks = {};
        this.ws = params.ws;
        this.ws.onmessage = this.applyCallbacks.bind(this);
        this.http = new HttpConnection(this);
    }

    applyCallbacks(event) {
        var response = JSON.parse(event.data);

        if (response.id in this.callbacks) {
            this.callbacks[response.id].cb(response);

            // Remove callback only for http methods
            if (response.protocol == 'http') {
                delete(this.callbacks[response.id]);
            }
        }
    }

    sendRequestToServer(msg, cb) {
        if (typeof msg.id == 'undefined') {
            throw new Error('msg must have an id');
        }

        if (typeof cb == 'function') {
            this.callbacks[msg.id] = {
                cb: cb
            };
        }

        this.ws.send(JSON.stringify(msg));
    }

    newTcpConnection(host, port) {
        return new TcpConnection({
            connection: this,
            host: host,
            port: port,
        });
    }

    udpSocket(){
        return new UdpConnection({
            connection: this
        });
    }

    generateId() {
        return Math.random().toString(36).substr(2);
    }

    close() {
        this.callbacks = {};
        this.ws.close();
    }
}

module.exports = function (host, port, cb) {
    let conn = new Connection({
        ws: new WebSocket(['ws://', host, ':', port].join('')),
    });

    conn.ws.onopen = () => {
        cb(conn);
    }

    // TODO: disconnection error handling

    // conn.ws.onclose = function(e) {
    // };

    // conn.ws.onerror = function(error) {
    // };
};