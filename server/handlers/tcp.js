let net = require('net');

module.exports = class TcpConnection {
    constructor(connection, id, host, port) {
        var self = this;

        self.connection = connection
        self.id   = id;
        self.host = host;
        self.port = port;
        self.is_connected = false;
        self.socket = new net.Socket();

        self.socket.connect(self.port, self.host, function() {
            self.is_connected = true;
            self.sendResponse('connect');
        });

        self.socket.on('close', function() {
            self.is_connected = false;
            self.sendResponse('close');
        });

        self.socket.on('data', function(data) {
            self.sendResponse('data', data);
        });
    }

    close() {
        if (!this.is_connected) {
            return;
        }

        return this.socket.destroy();
    }

    write(data) {
        if (!this.is_connected) {
            console.log('Tcp not connected. Cannot write');
            return;
        }

        this.socket.write(data + '\r\n');
    }

    sendResponse(event, data){
        data = data || null;

        let response = {
            id: this.id,
            event: event,
            data: data,
        };

        try {
            this.connection.send(JSON.stringify(response));
        } catch (e) {
        }
    }
}