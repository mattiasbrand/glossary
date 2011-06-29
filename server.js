var express = require('express');
var urlpaser = require('url');
var jade = require('jade');
var https = require('https');

var requiresLogin = function(req, res, next) {
        url = req.urlp = urlpaser.parse(req.url, true);
        if (url.pathname == "/login") {
            next();
            return;
        }

        if (req.session && req.session.user) {
            next();
        }
        else {
            res.writeHead(403);
            res.end('You are not authorized');
        }
    };

app = express.createServer();

app.configure(function() {
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/public/views');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'wth is this for?'
    }));
    app.use(requiresLogin);
    app.use(express.compiler({
        src: __dirname + '/public',
        enable: ['less']
    }));
});


app.get('/', function(req, res) {
    res.send("fooish");
});

app.get('/login', function(req, res) {
    res.render('login', {
        title: 'Enter your credentials'
    });
});

app.post('/login', function(req, res) {
    var auth = new Buffer('brand:underbar').toString('base64');
    var options = {
        host: 'brand.cloudant.com',
        port: 443,
        path: '/_all_dbs',
        method: 'GET',
        headers: {'Authorization' : 'Basic ' + auth }
    };
    
    var request = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);
    
        res.on('data', function(d) {
            console.log('Data' + d.toString());
        });
    });
    
    request.end();
    request.on('error', function(e) {
        console.error(e);
    });
    
    res.end();
});


app.listen(process.env.C9_PORT, '0.0.0.0');
console.log('Express server started on port %s', app.address().port);