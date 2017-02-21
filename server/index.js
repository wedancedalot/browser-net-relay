let WebSocket = require('ws');
let HttpHandler = require('./handlers/http.js');
let TcpHandler = require('./handlers/tcp.js');
let UdpHandler = require('./handlers/udp.js');
var debug = require('debug')('browser-net-relay:server')

module.exports = class Server {
    constructor(options) {
        let defaults = {
            // Port to bind websocket server on
            port: 8080,
        };

        this.options = Object.assign({}, defaults, options);

        this.ws = new WebSocket.Server({
            perMessageDeflate: false,
            port: this.options.port
        });

        this.ws.on('listening', function () {
            debug('Websocket started on port %d. Handling connections', this.options.port);
        })

        this.ws.on('connection', this.handleConnection);
    }

    handleConnection(conn) {
        debug('New connection established');

        let tcp_connections = {};
        let udp_connections = {};

        conn.on('message', function (request) {
            var request = JSON.parse(request);
            debug('Got request id [%s]. Protocol: [%s]. Method: [%s]', request.id, request.protocol, request.method);

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

                case 'udp':
                    switch (request.method) {
                        case 'create':
                            var handle = new UdpHandler(conn, request.id);
                            udp_connections[request.id] = handle;

                            break;

                        case 'close':
                            if (!(request.id in udp_connections)) {
                                // TODO: return error message for callback
                                console.error('Udp connection #' + request.id + ' was not established.');
                                return;
                            }

                            udp_connections[request.id].close();

                            delete(tcp_connections[request.id]);
                            break;

                        case 'bind':
                            if (!(request.id in udp_connections)) {
                                // TODO: return error message for callback
                                console.error('Udp connection #' + request.id + ' was not established.');
                                return;
                            }

                            udp_connections[request.id].bind(request.params);

                            break;

                        case 'send':
                            if (!(request.socket in udp_connections)) {
                                // TODO: return error message for callback
                                console.error('Udp connection #' + request.socket + ' was not established.');
                                return;
                            }

                            udp_connections[request.socket].send(request.id, request.params);
                            break;
                    }

                    break;
            }
        });

        conn.on('close', function () {
            // Close any open TCP sockets
            for (conn in tcp_connections) {
                tcp_connections[conn].close();
            }

            // Close all udp sockets
            for (conn in udp_connections) {
                udp_connections[conn].close();
            }

            tcp_connections = null;
            udp_connections = null;

            // TODO: cancel all http requests
        });
    }
}