let WebSocket = require('ws');
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
          break;

        case 'tcp':
          if (request.method == 'connect') {
            var handle = new TcpHandler(conn, request.id, request.params.host, request.params.port);
            tcp_connections[request.id] = handle;
          }

          if (request.method == 'write') {
            if (!(request.id in tcp_connections)) {
              console.error('Tcp connection #' + request.id + ' was not established.');
              return;
            }

            tcp_connections[request.id].write(request.params.data);
          }

          if (request.method == 'close') {
            if (!(request.id in tcp_connections)) {
              console.error('Tcp connection #' + request.id + ' was not established.');
              return;
            }

            tcp_connections[request.id].close();
            delete(tcp_connections[request.id]);
          }

          break;
      }
    });

    conn.on('close', function(){
      // Close any open TCP sockets
      for (conn in tcp_connections) {
        tcp_connections[conn].close();
        delete(tcp_connections[conn]);
      }

      // TODO: cancel all http requests
    });
  }
}