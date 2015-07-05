var config = require('./config');

var PORT = config.get('port');
var ADDRESS = config.get('address');

var fetcher = require('./fetcher');
var http = require('http');

var server = http.createServer(function (req, res) {
    fetcher.route(req, res);
});

server.listen(PORT, ADDRESS, function () {
    console.log('Server running at http://%s:%d/', ADDRESS, PORT);
    console.log('Press CTRL+C to exit');

    if (process.getgid() === 0) {
        process.setgid('daemon');
        process.setuid('daemon');
    }
});

process.on('SIGTERM', function () {
    if (server === undefined)
        return;
    server.close(function () {
        process.disconnect && process.disconnect();
    });
});