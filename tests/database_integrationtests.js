var cradle = require('cradle');
var assert = require('assert');

// Init connection
var connection = new(cradle.Connection)('https://brand.cloudant.com', 443, {
    auth: { username: 'brand', password: 'underbar' }
});

// Init database
var db = connection.database('glossary');

module.exports = {
    'Can get user brand': function(){
	db.get('brand', function(err, user) {
		assert.isNotNull(user);
		console.log(user);
		assert.equal(user.password, 'foo');
	});	
    }
};
