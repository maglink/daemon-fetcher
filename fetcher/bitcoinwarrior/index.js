var request = require('request');
var parseString = require('xml2js').parseString;

exports.fetch = function (fetchCallback) {

    request('http://bitcoinwarrior.net/feed/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            parseString(body, function (err, result) {
                result = cutResult(result)
                fetchCallback(result)
            });
        }
    })

}

var cutResult = function (obj) {
    try {
        var items = obj.rss.channel[0].item;
        for(var key in items) {
            delete items[key]['description']
            delete items[key]['content:encoded']
        }
        return items;
    } catch (err) {
        return {}
    }
}