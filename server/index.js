let WebSocket = require('ws');
let HttpHandler = require('./handlers/http.js');
let TcpHandler = require('./handlers/tcp.js');
let dgram = require('dgram');
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
                    let udp = dgram.createSocket('udp4');

                    switch (request.method) {
                        case 'write':
                            let buffer = new Buffer(request.params.data);
                            udp.send(buffer, request.params.port, request.params.host, (err) => {
                                let response = {
                                    id: request.id,
                                    protocol: 'udp',
                                    data: {
                                        err: err
                                    }
                                };

                                try {
                                    conn.send(JSON.stringify(response));
                                } catch (e) {
                                    debug('Error sending response %j', e);
                                }

                                udp.close();
                            });

                            break;

                        case 'bind':
                            udp.bind();

                            udp.on('error', (err) => {
                                let response = {
                                    id: request.id,
                                    protocol: 'udp',
                                    event: 'error',
                                    data: {
                                        err: err
                                    }
                                };

                                try {
                                    conn.send(JSON.stringify(response));
                                } catch (e) {
                                    debug('Error sending response %j', e);
                                }

                                udp.close();
                            });

                            udp.on('message', (msg, rinfo) => {
                                let response = {
                                    id: request.id,
                                    protocol: 'udp',
                                    event: 'message',
                                    data: {
                                        msg: msg,
                                        rinfo: rinfo
                                    }
                                };

                                try {
                                    conn.send(JSON.stringify(response));
                                } catch (e) {
                                    debug('Error sending response %j', e);
                                }

                                console.log(rinfo);
                                console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
                            });

                            udp.on('listening', () => {
                                let response = {
                                    id: request.id,
                                    event: 'listening',
                                    protocol: 'udp',
                                    data: udp.address()
                                };

                                try {
                                    conn.send(JSON.stringify(response));
                                } catch (e) {
                                    debug('Error sending response %j', e);
                                }
                            });

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
            // TODO: close all udp sockets
        });
    }
}