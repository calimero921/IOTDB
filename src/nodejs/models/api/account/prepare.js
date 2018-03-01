const Moment = require('moment');
const Log4n = require('../../../utils/log4n.js');
const Validator = require('ajv');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/sessions/prepare');
    // log4n.object(data,'data');

    let result = {};

    let validator = new Validator();
    let schema = {
        "id": {type: "string"},
        "firstname": {type: "string"},
        "lastname": {type: "string"},
        "email": {type: "string"}
    };
    let validate = validator.compile(schema);

    validate(data)
        .then(valid => {
	        if (typeof data !== 'undefined') {
		        if (typeof valid.account_id !== 'undefined') result.account_id = valid.account_id;
		        if (typeof valid.account_firstname !== 'undefined') result.account_firstname = valid.account_firstname;
		        if (typeof valid.account_lastname !== 'undefined') result.account_lastname = valid.account_lastname;
		        if (typeof valid.account_email !== 'undefined') result.account_email = valid.account_email;
		        result.account_last_connexion_date = parseInt(Moment().format('x'));
	        }
	
	        // log4n.object(result,'result');
	        log4n.debug('done - ok');
	        return result;
        })
        .catch(error => {
	        return errorparsing({
		        error_code: 500,
		        error_message: error.message + " (" + error.errors[0].dataPath + " " + error.errors[0].message + ")"
	        });
        });
};
