'use strict';

var express = require('express'),
    request = require('request'),

    app = express();

// Enabling CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Proxy!
app.use('/api', function(req, res) {
    var beUrl = req.url.substr(1), beReqStream;
    console.log('Connecting to %s', beUrl);

    beReqStream = request(beUrl);
    req.pipe(beReqStream).pipe(res);

    // Error handling
    beReqStream.on('error', function(err) {
        console.log('Failed.. (%s)', beUrl);

        res.statusCode = 500;
        res.send({
            message: 'Connection to ' + beUrl + ' failed.'
        });
    });
});

var server = app.listen(3001, function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('Proxy running at http://%s:%s', host, port);
});

