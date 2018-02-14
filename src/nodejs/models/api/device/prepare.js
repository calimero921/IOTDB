const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/sessions/prepare');
    // log4n.object(data,'data');

    let result = {};
    try {
        if (typeof data !== 'undefined') {
            if (typeof data.id !== 'undefined') result.device_id = data.id;
            if (typeof data.serial_number !== 'undefined') result.device_serial_number = data.serial_number;
            if (typeof data.manufacturer !== 'undefined') result.device_manufacturer = data.manufacturer;
            if (typeof data.name !== 'undefined') result.device_name = data.name;
            if (typeof data.class !== 'undefined') result.device_class = data.class;
            if (typeof data.software_version !== 'undefined') result.device_software_version = data.software_version;
            if (typeof data.capabilities !== 'undefined') {
                result.device_capabilities = [];
                for(var i = 0; i < data.capabilities.length; i++) {
                    var datas = data.capabilities[i];
                    var capability = {"name": datas.name, "type": datas.type, "last_value": 0};
                    switch (datas.type.toUpperCase()) {
                        case 'SENSOR':
                            capability.publish = "sensor";
                            capability.subscribe = "";
                            break;
                        case 'SWITCH':
                            capability.publish = "switch";
                            capability.subscribe = "switch/" + data.id;
                            break;
                        case 'SLAVE':
                            capability.publish = "";
                            capability.subscribe = "slave/" + data.id;
                            break;
                        default:
                            capability.publish = "";
                            capability.subscribe = "";
                            break;

                    }
                    result.device_capabilities.push(capability);
                }
            }
            if (typeof data.key !== 'undefined') result.device_key = data.key;
            result.device_last_connexion_date = parseInt(moment().format('x'));
        }
    } catch (error) {
        log4n.object(error,'error');
    }

    // log4n.object(result,'result');
    // log4n.object(result,'result');
    log4n.debug('done - ok');
    return result;
};
