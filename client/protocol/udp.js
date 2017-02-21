let EventEmitter = require('events').EventEmitter

module.exports = class extends EventEmitter {
    constructor(params) {
        super();

        var self = this;
        self.connection = params.connection;
        self.id = self.connection.generateId();
    }

    send(data, port, host, cb) {
        var self = this;

        var msg = {
            id: self.connection.generateId(),
            protocol: 'udp',
            method: 'write',
            params: {
                data: data,
                port: port,
                host: host
            }
        }

        this.connection.sendRequestToServer(msg, function (response) {
            cb(response.data);
            delete(self.connection.callbacks[msg.id]);
        });
    }

    bind() {
        var self = this;

        var msg = {
            id: self.id,
            protocol: 'udp',
            method: 'bind',
            params: {}
        }

        self.connection.sendRequestToServer(msg, function (response) {
            switch (response.event) {
                case 'error':
                    self.emit('error', response.data);
                    break;

                case 'message':
                    self.emit('message', response.data);

                    break;

                case 'listening':
                    self.emit('listening', response.data);
                    break;
            }
        });
    }

    // close() {
    //     var msg = {
    //         id: this.id,
    //         protocol: 'tcp',
    //         method: 'close',
    //         params: {}
    //     }
    //
    //     this.connection.sendRequestToServer(msg);
    // }
}