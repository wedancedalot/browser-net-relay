let Relay = require('../index.js');

Relay.Connect('localhost', 8080, function(conn){
    var tcp = conn.newTcpConnection('127.0.0.1', 6379);
    tcp.on('connect', function(){
        // We can send data here or close a connection
        tcp.write('monitor');
        // tcp.close();
    });

    tcp.on('close', function(){
        // Conn closed
        console.log('Close:');
    });

    tcp.on('data', function(data){
        // Receive some data
        console.log(data);
    });

    // conn.http.post('http://wedancedalot.github.io', {test: 1}, function(resp){
    //     console.log(resp);
    // });
});