const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/sessions/prepare');
    // log4n.object(data,'data');

    var result = {};
    if (typeof data !== 'undefined') {
        if (typeof data.account_id !== 'undefined') result.account_id = data.account_id;
        if (typeof data.account_firstname !== 'undefined') result.account_firstname = data.account_firstname;
        if (typeof data.account_lastname !== 'undefined') result.account_lastname = data.account_lastname;
        if (typeof data.account_email !== 'undefined') result.account_email = data.account_email;
        result.account_last_connexion_date = parseInt(moment().format('x'));
    }

    // log4n.object(result,'result');
    log4n.debug('done - ok');
    return result;
};
