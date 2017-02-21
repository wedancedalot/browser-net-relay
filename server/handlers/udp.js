const dgram = require('dgram');

module.exports = class TcpConnection {
    constructor(connection, id) {
        var self = this;

        self.connection = connection
        self.id = id;
        self.is_connected = false;
        self.socket = dgram.createSocket('udp4');

        self.socket.on('close', () => {
            self.sendResponse('close');
        });

        self.socket.on('error', (err) => {
            self.sendResponse('error', err);
        });

        self.socket.on('message', (msg, rinfo) => {
            self.sendResponse('message', {
                msg: msg,
                rinfo: rinfo
            });
        });

        self.socket.on('listening', () => {
            let address = self.socket.address();
            self.sendResponse('listening', address);
        });
    }

    send(id, params){
        let buffer = new Buffer(params.data);

        this.socket.send(buffer, params.offset, params.length, params.port, params.address, (err) => {
            let response = {
                id: id,
                protocol: 'udp',
                event: 'send',
                data: err,
            };

            try {
                this.connection.send(JSON.stringify(response));
            } catch (e) {
            }
        })
    }

    close(){
        try {
            this.socket.close();
        } catch (err) {
        }
    }

    bind(params){
        try {
            this.socket.bind(params.port, params.address);
        } catch (err) {
            this.sendResponse('panic', err.message);
        }
    }

    sendResponse(event, data) {
        data = data || null;

        let response = {
            id: this.id,
            protocol: 'udp',
            event: event,
            data: data,
        };

        try {
            this.connection.send(JSON.stringify(response));
        } catch (e) {
        }
    }
}