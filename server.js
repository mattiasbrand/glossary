var express = require('express');
var urlpaser = require('url');
var jade = require('jade');
var https = require('https');
var cradle = require('cradle');

var requiresLogin = function(req, res, next) {
        url = req.urlp = urlpaser.parse(req.url, true);
        if (url.pathname == "/login") {
            next();
            return;
        }

	console.log(req.session);
        if (req.session && req.session.user) {
            next();
        }
        else {
            res.writeHead(403);
            res.end('You are not authorized');
        }
    };

// Init connection
var connection = new(cradle.Connection)('https://brand.cloudant.com', 443, {
    auth: { username: 'brand', password: 'underbar' }
});

// Init database
var db = connection.database('glossary');

// Init express
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
    db.get(req.body.username, function(err, user) {
	console.log(req.body);
	if(err) console.log(err);
	console.log(user.password);
	if(user.password == req.body.password) {
		req.session.user = req.body.username;
		req.session.auth = true;
	}
    });
    
    res.end();
});

var port = 8080; // process.env.C9_PORT,
var url = 'localhost'; //  '0.0.0.0'
app.listen(port,url);
console.log('Express server started on port %s', app.address().port);

//'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//    return v.toString(16);
//});
