let WebSocket = require('ws');
let HttpHandler = require('./handlers/http.js');
let TcpHandler = require('./handlers/tcp.js');

module.exports = class Server {
    constructor(port) {
        this.ws = new WebSocket.Server({
            perMessageDeflate: false,
            port: 8080
        });

        this.ws.on('connection', this.handleConnection);
    }

    handleConnection(conn) {

        let tcp_connections = {};

        conn.on('message', function (request) {

            var request = JSON.parse(request);

            switch (request.protocol) {
                case 'http':
                    switch (request.method) {
                        case 'get':
                            var handle = new HttpHandler(conn);
                            handle.get(request.id, request.params.url);
                            break;

                        case 'post':
                            var handle = new HttpHandler(conn);
                            handle.post(request.id, request.params.url, request.params.data);
                            break;
                    }
                    break;

                case 'tcp':
                    switch (request.method) {
                        case 'connect':
                            var handle = new TcpHandler(conn, request.id, request.params.host, request.params.port);
                            tcp_connections[request.id] = handle;
                            break;

                        case 'write':
                            if (!(request.id in tcp_connections)) {
                                console.error('Tcp connection #' + request.id + ' was not established.');
                                return;
                            }

                            tcp_connections[request.id].write(request.params.data);
                            break;

                        case 'close':
                            if (!(request.id in tcp_connections)) {
                                console.error('Tcp connection #' + request.id + ' was not established.');
                                return;
                            }

                            tcp_connections[request.id].close();
                            delete(tcp_connections[request.id]);
                            break;
                    }

                    break;
            }
        });

        conn.on('close', function () {
            // Close any open TCP sockets
            for (conn in tcp_connections) {
                tcp_connections[conn].close();
                delete(tcp_connections[conn]);
            }

            // TODO: cancel all http requests
        });
    }
}