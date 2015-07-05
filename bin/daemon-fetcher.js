#!/usr/bin/env node

require('daemon')();

var config = require('../config');
var cluster = require('cluster');

function createWorker() {
    if (cluster.isMaster) {
        var child = cluster.fork();
        child.on('exit', function (code, signal) {
            createWorker();
        });
    } else {
        require('../start');
    }
}

function createWorkers(n) {
    while (n-- > 0) {
        createWorker();
    }
}

function killAllWorkers(signal) {
    var uniqueID, worker;
    for (uniqueID in cluster.workers) {
        if (cluster.workers.hasOwnProperty(uniqueID)) {
            worker = cluster.workers[uniqueID];
            worker.removeAllListeners();
            worker.process.kill(signal);
        }
    }
}

process.on('SIGHUP', function () {
    killAllWorkers('SIGTERM');
    createWorkers(config.get('workers'));
});

process.on('SIGTERM', function () {
    killAllWorkers('SIGTERM');
});

createWorkers(config.get('workers'));
