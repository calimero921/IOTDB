const querystring = require('querystring');
const Log4n = require('./log4n.js');

module.exports = function(object) {
	const log4n = new Log4n('/utils/checkJSON');

	let result;
	try {
		result = JSON.parse(object);
	} catch (e) {
		result = querystring.parse(object);
	}
	// log4n.object(result, 'result');
    log4n.debug('done');
	return result;
};