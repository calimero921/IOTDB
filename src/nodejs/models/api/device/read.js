const Log4n = require('../../../utils/log4n.js');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/device/read');
    // console.log('data:', data);

    let result = {};
    if (typeof data !== 'undefined') {
        if (typeof data.device_id !== 'undefined') result.id = data.device_id;
        if (typeof data.device_manufacturer !== 'undefined') result.manufacturer = data.device_manufacturer;
        if (typeof data.device_serial_number !== 'undefined') result.serial_number = data.device_serial_number;
        if (typeof data.device_name !== 'undefined') result.name = data.device_name;
        if (typeof data.device_creation_date !== 'undefined') result.creation_date = data.device_creation_date.toString();
        if (typeof data.device_class !== 'undefined') result.class = data.device_class;
        if (typeof data.device_software_version !== 'undefined') result.software_version = data.device_software_version;
        if (typeof data.device_capabilities !== 'undefined') {result.capabilities = data.device_capabilities;};
        if (typeof data.device_last_connexion_date !== 'undefined') result.last_connexion_date = data.device_last_connexion_date.toString();
    }

    // log4n.object(result,'result');
    log4n.debug('done - ok');
    return result;
};
