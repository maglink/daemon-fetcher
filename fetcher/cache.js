var config = require('../config');

var CACHE_LIFETIME = config.get("fetcher:cache:lifetime")

var Cache = [];

exports.get = function (name) {
    try {
        return Cache[name].value;
    } catch (err) {
        return {}
    }
}

exports.set = function (name, value) {
    var cache = {};

    var d = new Date();
    cache.time = d.getTime();
    cache.value = value;

    Cache[name] = cache;
}

exports.check = function (name) {
    try {
        if (Cache[name].block) {
            return true;
        }
        
        var d = new Date();
        if (d.getTime() - Cache[name].time > CACHE_LIFETIME) {
            return false;
        }
        
        return true;
    } catch (err) {
        return false;
    }
}

exports.block = function (name) {
    try {
        Cache[name].block = true;
        return true;
    } catch (err) {
        return false;
    }
}

