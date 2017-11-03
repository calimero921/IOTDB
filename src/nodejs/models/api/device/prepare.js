const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/sessions/prepare');
    // log4n.object(data,'data');

    var result = {};
    if (typeof data !== 'undefined') {
        if (typeof data.device_id !== 'undefined') result.device_id = data.device_id;
        if (typeof data.device_serial_number !== 'undefined') result.device_serial_number = data.device_serial_number;
        if (typeof data.device_name !== 'undefined') result.device_name = data.device_name;
        if (typeof data.device_creation_date !== 'undefined') {
            result.device_creation_date = data.device_creation_date.toString();
        } else {
            result.device_creation_date = parseInt(moment().format('x'));
        }
        if (typeof data.device_class !== 'undefined') result.device_class = data.device_class;
        if (typeof data.device_software_version !== 'undefined') result.device_software_version = data.device_software_version;
        if (typeof data.device_last_connexion_date !== 'undefined') {
            result.device_last_connexion_date = data.device_last_connexion_date.toString();
        } else {
            result.device_last_connexion_date = parseInt(moment().format('x'));
        }
    }

    // log4n.object(result,'result');
    log4n.debug('done - ok');
    return result;
};
