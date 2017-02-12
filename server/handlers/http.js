let http = require('http');

// http.get(data.params.url, (res) => {
                //     // res.setEncoding('utf8');

                //     let rawData = '';
                //     res.on('data', (chunk) => {
                //         rawData += chunk
                //     });

                //     res.on('end', () => {
                //         msg.data = rawData;
                //         conn.send(JSON.stringify(msg));
                //     });
                // }).on('error', (e) => {
                //     msg.error = e;
                //     conn.send(JSON.strigify(msg));
                // });

                // var options = {
                //   hostname: data.params.url
                //   port: 80,
                //   path: '/catchers/544b09b4599c1d0200000289',
                //   method: 'POST',
                //   // headers: {
                //   //     'Content-Type': 'application/json',
                //   // }
                // };

                // var req = http.request(options, function(res) {
                //   console.log('Status: ' + res.statusCode);
                //   console.log('Headers: ' + JSON.stringify(res.headers));
                //   res.setEncoding('utf8');
                //   res.on('data', function (body) {
                //     console.log('Body: ' + body);
                //   });
                // });

                // req.on('error', function(e) {
                //   console.log('problem with request: ' + e.message);
                // });

                // // write data to request body
                // req.write('{"string": "Hello, World"}');
                // req.end();