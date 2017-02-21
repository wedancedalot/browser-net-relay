let Relay = require('../index.js');

Relay.Connect('localhost', 8080, function (conn) {
    // var tcp = conn.newTcpConnection('127.0.0.1', 6379);
    // tcp.on('connect', function(){
    //     // We can send data here or close a connection
    //     tcp.write('monitor');
    //     // tcp.close();
    // });
    //
    // tcp.on('close', function(){
    //     // Conn closed
    //     console.log('Close:');
    // });
    //
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

    var udp = conn.udpSocket();

    

    // Client example
    var buf1 = Buffer.from('Some asdasdad');
    udp.send(buf1, 2710, 'shubt.net', (err) => {
        console.log(err)
    });
    
    // Server example
    udp.bind();
    
    udp.on('error', (a) => {
        console.log(a);
    });
    
    udp.on('message', (a) => {
        console.log(a);
    });
    
    udp.on('listening', (a) => {
        console.log(a);
    });
    
});