var cfg = require('config.json');
var express = require("express");
var fs = require('fs');
var https = require('https');
var util = require("util");


var app = express();
express.logger();
var wwwPath = process.cwd() + cfg.wwwPath;
util.puts("Serving:" + wwwPath);
app.use(express.static(wwwPath));

var options = {
    host: cfg.ipAddress,
    key: fs.readFileSync(cfg.keyPath + '/server.key'),
    cert: fs.readFileSync(cfg.keyPath + '/server.crt')
};

var server = https.createServer(options, app).listen(cfg.port);

var io = require('socket.io');

var socket = io.listen(server);
socket.configure(function() {
    socket.set('log level', 1);
})

var clients = {};

socket.on('connection', function(client){
    var ident;

    client.on('init', function(data){
        util.puts("Identified as " + data.ident);
        ident = data.ident;
        clients[ident] = client;
    });

    client.on('broadcast', function(data) {
        for (c in clients) {
            if (clients.hasOwnProperty(c) && c !== ident) {
                util.puts("Forwarding broadcast message to " + ident);
                clients[c].emit('broadcast', data);
            }
        }
    });

    client.on('disconnect', function() {
        if (clients.hasOwnProperty(ident)) {
            if (clients[ident] == client) {
                delete clients[ident];
            }
        }
    });
})
