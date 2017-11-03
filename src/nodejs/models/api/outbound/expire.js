const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/sessions/expire');
    // log4n.object(data,'data');

    var result;
    try {
        if (typeof data !== 'undefined') {
            var now = moment();
            var expire = moment(parseInt(data));
            result = moment(expire).isSameOrBefore(now);
        }
    } catch (e) {
        //expire d'office en cas d'erreur
        result = true;
    }

    // log4n.object(result,'result');
    log4n.debug('done - ok');
    return result;
};
