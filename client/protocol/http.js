// module.exports = class {
//   constructor(client) {
//     this.client = client;
//   }

//   get(url, cb) {
//     var msg = {
//         protocol: 'http',
//         method: 'GET',
//         params: {
//             url: url
//         }
//     }

//     this.client.sendRequestToServer(msg, cb);
//   }

//   post(url, params, cb) {
//     var msg = {
//         protocol: 'http',
//         method: 'POST',
//         params: {
//             url: url,
//             params: params
//         }
//     }

//     this.client.sendRequestToServer(msg, cb);
//   }
// }
