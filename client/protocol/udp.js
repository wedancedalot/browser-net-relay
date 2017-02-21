let EventEmitter = require('events').EventEmitter

module.exports = class extends EventEmitter {
    constructor(params) {
        super();

        var self = this;
        self.connection = params.connection;
        self.id = self.connection.generateId();
        self.is_closed = false;
        self.info = null;
        self.port = null;

        var msg = {
            id: self.id,
            protocol: 'udp',
            method: 'create',
            params: {}
        }

        self.connection.sendRequestToServer(msg, function (response) {
            switch (response.event) {
                case 'close':
                    self.is_closed = true;
                    self.emit('close');

                    // Remove callback
                    delete(self.connection.callbacks[self.id]);
                    break;

                case 'error':
                    self.emit('error', response.data);
                    break;

                case 'message':
                    self.emit('message', response.data.msg, response.data.rinfo);
                    break;

                case 'listening':
                    self.info = response.data;

                    self.emit('listening');
                    break;

                case 'panic':
                    throw new Error(response.data);
                    break;
            }
        });
    }

    send(data, offset, length, port, address, cb){
        var self = this;

        if (self.is_closed) {
            throw new Error('Not running');
        }

        var msg = {
            id: self.connection.generateId(),
            socket: self.id,
            protocol: 'udp',
            method: 'send',
            params: {
                data: data,
                offset: offset,
                length: length,
                port: port,
                address: address
            }
        }

        self.connection.sendRequestToServer(msg, function(response){
            // Remove callback
            delete(self.connection.callbacks[msg.id]);

            if (typeof cb == 'function') {
                cb(response.data)
            }
        });
    }

    address(){
        return this.info
    }

    bind(port, address) {
        if (this.is_closed) {
            throw new Error('Not running');
        }

        var msg = {
            id: this.id,
            protocol: 'udp',
            method: 'bind',
            params: {
                port: port,
                address: typeof address != 'undefined' ? address : null,
            }
        }

        this.connection.sendRequestToServer(msg);
    }

    close() {
        var msg = {
            id: this.id,
            protocol: 'udp',
            method: 'close',
            params: {}
        }

        this.connection.sendRequestToServer(msg);
    }
}