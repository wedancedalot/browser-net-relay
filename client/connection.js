let TcpConnection = require('./protocol/tcp.js');
let HttpConnection = require('./protocol/http.js');

module.exports = class {
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

    generateId() {
        return Math.random().toString(36).substr(2);
    }

    close() {
        this.callbacks = {};
        this.ws.close();
    }
}

