let TcpConnection = require('./protocol/tcp.js');

module.exports = class {
    constructor(params) {
        this.callbacks = {};
        this.ws = params.ws;
        this.ws.onmessage = this.applyCallbacks.bind(this);
    }

    applyCallbacks(event){
        var response = JSON.parse(event.data);

        if (response.id in this.callbacks) {
            this.callbacks[response.id].cb(response);
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

    newTcpConnection(host, port){
        return new TcpConnection({
            connection: this,
            host: host,
            port: port,
        });
    }

    close() {
        this.callbacks = {};
        this.ws.close();
    }
}

