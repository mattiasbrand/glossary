var cradle = require('cradle');

// Init connection
var connection = new(cradle.Connection)('https://brand.cloudant.com', 443, {
    auth: { username: 'brand', password: 'underbar' }
});

// Init database
var db = connection.database('glossary');

var glossaryService = exports;
glossaryService.createWord = function (word, translations, callback) {
	db.save(word, {
		type: 'word',
		translations: translations
	}, callback);
};
glossaryService.deleteWord = function (wordId, callback) {
	db.remove(wordId, callback);
};
glossaryService.isAuthorized = function (httpRequest) {
	db.get(httpRequest.body.username, function(err, user) {
		if(err) console.log(err);
		if(user.password == httpRequest.body.password) {
			httpRequest.session.user = httpRequest.body.username;
			httpRequest.session.auth = true;
		}
	});
};
