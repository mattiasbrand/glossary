var cradle = require('cradle');
var settings = require('../settings');

// Init connection
var connection = new(cradle.Connection)(settings.couchdb.host, settings.couchdb.port, {
    auth: { username: settings.couchdb.user, password: settings.couchdb.password }
});

// Init database
var db = connection.database(settings.couchdb.database);

var glossaryService = exports;
glossaryService.createWord = function (word, translations, callback) {
	db.save('word_' + word, {
		word: word,
		type: 'word',
		translations: translations
	}, callback);
};
glossaryService.deleteWord = function (word, callback) {
	db.remove('word_' + word, callback);
};
glossaryService.getWord = function(word, callback) {
	db.get('word_' + word, callback);
};
glossaryService.authorize = function (httpRequest, callback) {
	db.get(httpRequest.body.username, function(err, user) {
		if(err) {
			console.log(err);
			callback(false);
			return;
		}

		if(user.password == httpRequest.body.password) {
			httpRequest.session.user = httpRequest.body.username;
			httpRequest.session.auth = true;
			callback(true);
			return;
		}

		callback(false);
	});
};

glossaryService.getNextWord = function (callback) {
	db.view('foo/foo', {limit:1}, function(err, res) {
		callback(res[0].value);
	});
};

glossaryService.saveAnswer = function(word, correctAnswers, wrongAnswers, dateAnswered, callback) {
	db.merge('word_' + word, { correctAnswers:correctAnswers, wrongAnswers:wrongAnswers, lastAnswered:dateAnswered}, callback);
};
