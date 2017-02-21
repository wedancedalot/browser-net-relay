const request = require('request');

module.exports = class {
    constructor(connection) {
        this.connection = connection
    }

    get(id, url) {
        var self = this;

        request(url, function (err, resp, body) {
            self.sendResponse(id, err, resp, body);
        })
    }

    post(id, url, data) {
        var self = this;

        request.post({
            url: url,
            form: data
        }, function (err, resp, body) {
            self.sendResponse(id, err, resp, body);
        })
    }

    sendResponse(id, err, resp, body) {
        let response = {
            id: id,
            protocol: 'http',
            data: {
                err: err,
                resp, resp,
                body: body,
            }
        };

        try {
            this.connection.send(JSON.stringify(response));
        } catch (e) {
        }
    }
}