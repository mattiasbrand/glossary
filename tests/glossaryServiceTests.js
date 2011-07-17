var assert = require('assert');
var glossaryService = require('../glossaryService.js');

module.exports = {
    'Can insert new word': function(){
	console.log(glossaryService);
	glossaryService.createWord('words/snygg', [ 'fine', 'handsome' ], function(err, resp) {
		assert.isNull(err);
		console.log(resp);
		glossaryService.deleteWord('words/snygg', function(err, resp) {
			assert.isNull(err);
		});
	});	
    }
};
