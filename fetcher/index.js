var config = require('../config');
var cache = require('./cache');

var fetchersLoad = function () {
    var fetchers = [];
    var fetcherModules = config.get('fetcher:modules');
    for (var key in fetcherModules) {
        var fetcherName = fetcherModules[key];
        fetchers[fetcherName] = require('./' + fetcherName);
    }

    return fetchers;
}

var fetchers = fetchersLoad();

var fetcherCall = function (fetcherName, cb) {
    if (cache.check(fetcherName)) {
        cb(cache.get(fetcherName))
    } else {
        cache.block(fetcherName)
        var module = fetchers[fetcherName];
        module.fetch(function (data) {
            cache.set(fetcherName, data)
            cb(data)
        })
    }
}

var fetcherHundler = function (obj, req, res) {
    var json = JSON.stringify(obj);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(json);
}

exports.route = function (req, res) {

    for (var fetcherName in fetchers) {
        if (req.url == '/' + fetcherName) {
            fetcherCall(fetcherName, function (data) {
                fetcherHundler(data, req, res)
            })
            return;
        }
    }

    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("404 Not Found\n");
    res.end();
}