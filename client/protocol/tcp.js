let EventEmitter = require('events').EventEmitter

module.exports = class extends EventEmitter {
    constructor(params) {
        super();

        var self = this;

        self.connection = params.connection;
        self.host = params.host;
        self.port = params.port;
        self.id = self.connection.generateId(),
        self.is_connected = false;

        // Let's try to connect
        var msg = {
            id: self.id,
            protocol: 'tcp',
            method: 'connect',
            params: {
                host: self.host,
                port: self.port,
            }
        }

        self.connection.sendRequestToServer(msg, function (response) {
            switch (response.event) {
                case 'connect':
                    self.is_connected = true;
                    self.emit('connect');
                    break;

                case 'close':
                    self.is_connected = false;
                    self.emit('close');

                    // Remove callback
                    delete(self.connection.callbacks[self.id]);

                    break;

                case 'data':
                    self.emit('data', response.data);
                    break;
            }
        });
    }

    write(data) {
        if (!this.is_connected) {
            throw new Error('Connection is not established yet');
        }

        var msg = {
            id: this.id,
            protocol: 'tcp',
            method: 'write',
            params: {
                data: data
            }
        }

        this.connection.sendRequestToServer(msg);
    }

    close() {
        if (!this.is_connected) {
            return;
        }

        var msg = {
            id: this.id,
            protocol: 'tcp',
            method: 'close',
            params: {}
        }

        this.connection.sendRequestToServer(msg);
    }
}