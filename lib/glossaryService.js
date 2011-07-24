var cradle = require('cradle');

// Init connection
var connection = new(cradle.Connection)('https://brand.cloudant.com', 443, {
    auth: { username: 'brand', password: 'underbar' }
});

// Init database
var db = connection.database('glossary');

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
		if(err) console.log(err);
		if(user.password == httpRequest.body.password) {
			httpRequest.session.user = httpRequest.body.username;
			httpRequest.session.auth = true;
			callback(true);
		}

		callback(false);
	});
};

glossaryService.getNextWord = function (callback) {
	db.view('foo/foo', {limit:1}, function(err, res) {
		callback(res[0].value);
	});
};
