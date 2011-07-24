var assert = require('assert');
var glossaryService = require('../lib/glossaryService.js');

module.exports = {
'Can insert new word': function(){
	glossaryService.createWord('snygg', [ 'fine', 'handsome' ], function(err, resp) {
		assert.isNull(err);
		glossaryService.deleteWord('snygg', function(err, resp) {
			assert.isNull(err);
		});
	});	
},

'Can get word': function() {
	glossaryService.createWord('ful', [ 'ugly' ], function(err, resp) {
		assert.isNull(err);
		glossaryService.getWord('ful', function(err, doc) {
			assert.isNull(err);
			assert.isNotNull(doc);
			assert.equal(doc.word, 'ful');
		});
		glossaryService.deleteWord('ful', function(err, resp) {
			assert.isNull(err);
		});
	});	
},

'Can query next word' : function() {
	glossaryService.getNextWord(function(word) {
		console.log(word);
		assert.isNotNull(word);
	});
}
};
