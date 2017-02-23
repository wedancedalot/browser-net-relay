module.exports = class {
    constructor(connection) {
        this.connection = connection;
    }

    get(url, cb) {
        var self = this;

        var msg = {
            id: this.connection.generateId(),
            protocol: 'http',
            method: 'get',
            params: {
                url: url
            }
        }

        this.connection.sendRequestToServer(msg, function (response) {
            cb(response.data.err, response.data.resp, response.data.body);
            delete(self.connection.callbacks[response.id]);
        });
    }

    post(url, data, cb) {
        var self = this;

        var msg = {
            id: this.connection.generateId(),
            protocol: 'http',
            method: 'post',
            params: {
                url: url,
                data: data
            }
        }

        this.connection.sendRequestToServer(msg, function (response) {
            cb(response.data.err, response.data.resp, response.data.body);
            delete(self.connection.callbacks[response.id]);
        });
    }
}
