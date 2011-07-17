require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var express = require('express');
var urlpaser = require('url');
var jade = require('jade');
var https = require('https');
var glossaryService = require('glossaryService');
console.log(glossaryService);

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
    res.render('answer', {
	title: 'Practice your language skills!',
        wordToTranslate: 'Snygg'
    });
});

app.get('/login', function(req, res) {
    res.render('login', {
        title: 'Enter your credentials'
    });
});

app.post('/login', function(req, res) {
	if(glossaryService.isAuthorized(req)) {
		res.redirect('/');
	}
    
	res.end();
});

var port = 8081; // process.env.C9_PORT,
var url = 'localhost'; //  '0.0.0.0'
app.listen(port,url);
console.log('Express server started on port %s', app.address().port);

//'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//    return v.toString(16);
//});
