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
            id: this.id,
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