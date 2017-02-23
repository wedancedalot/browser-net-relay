const RelayClient = require('../client/index.js');

RelayClient('localhost', 8080, function (conn) {
    // var tcp = conn.newTcpConnection('127.0.0.1', 6379);
    // tcp.on('connect', function(){
    //     // We can send data here or close a connection
    //     tcp.write('monitor');
    //     // tcp.close();
    // });

    // tcp.on('close', function(){
    //     // Conn closed
    //     console.log('Close:');
    // });

    // tcp.on('error', function(err){
    //     // Conn closed
    //     console.log(err);
    // });

    // tcp.on('data', function(data){
    //     // Receive some data
    //     console.log(data);
    // });

    // conn.http.get('https://wedancedalot.github.io', function (err, resp, body) {
    //     console.log(body);
    // });

    // conn.http.post('https://wedancedalot.github.io', {test: 1}, function (err, resp, body) {
    //     console.log(resp);
    // });


    // var udp = conn.udpSocket();
    // udp.bind(65511);

    // udp.on('close', () => {
    //     console.log('close');
    // });

    // udp.on('error', (err) => {
    //     console.log('error', err);
    // });

    // udp.on('message', (msg, rinfo) => {
    //     console.log('message', {
    //         msg: msg,
    //         rinfo: rinfo
    //     });
    // });

    // udp.on('listening', () => {
    //     let address = udp.address();
    //     console.log('listening', address.address, address.port);
    // });

    // var buf1 = Buffer.from('Some asdasdad');
    // udp.send(buf1, 0, buf1.length, 2710, 'shubt.net', (err) => {
    //     console.log(err)
    //     // udp.close()
    // });
});

