require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);

var express = require('express');
var express_params = require('express-params');
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

        if (req.session && req.session.user) {
            next();
        }
        else {
			res.redirect('/login');
			return;
            //res.end('You are not authorized');
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

// Apply params extension to express
express_params.extend(app);
 
app.param(':word', function(req, res, next, param) {
	glossaryService.getWord(param, function(err, word) {
		if(err) {
			if(err.error !== 'not_found') return next(err);
		}
		req.word = word;
		console.log("Found: " + word);
		next();
	});
});

app.get('/', function(req, res) {
    res.redirect('/answer');
});

app.get('/answer/:word', function(req, res) {
	console.log("Got: " + req.word);
	if(req.word === undefined) {
		res.redirect('/create/' + req.params.word);
		return;
	}
    res.render('answer', {
	title: 'Practice your language skills!',
        wordToTranslate: word.word
    });
	res.end();
});

app.get('/create/:newWord', function(req, res) {
	res.end('Create new word');
});


app.post('/answer/:word', function(req, res) {
    if(req.word === undefined) res.end(req.params.word + ' does not exist');
	if(req.word.translations.contains(req.body.answer)) res.end('Correct!');
	res.end('Wrong!');
});

app.get('/login', function(req, res) {
    res.render('login', {
        title: 'Enter your credentials'
    });
});

app.post('/login', function(req, res) {
	glossaryService.authorize(req, function (result) {
		if(result === true)	res.redirect('back');
		else res.end('Failed login');
	});
});

var port = 8081; // process.env.C9_PORT,
var url = 'localhost'; //  '0.0.0.0'
app.listen(port,url);
console.log('Express server started on port %s', app.address().port);

//'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//    return v.toString(16);
//});
