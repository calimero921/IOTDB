const Log4n = require('../../../utils/log4n.js');
const errorparsing = require('../../../utils/errorparsing.js');
const mongoClient = require('../../mongodbupdate.js');
const read = require('./read.js');
const prepare = require('./prepare.js');

module.exports = function (device_id, new_device) {
    const log4n = new Log4n('/models/api/device/patch');
    log4n.object(device_id,'device_id');
    log4n.object(new_device,'new_device');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof device_id === 'undefined' || typeof new_device === 'undefined') {
            reject(errorparsing({error_code: 400}));
            log4n.debug('done - missing paramater')
        } else {
            var query = {};
            query.device_id = device_id;
            //au cas ou on usurperait le device
            new_device.id = device_id;
            var parameter = prepare(new_device);
            mongoClient('device', query, parameter)
                .then(datas => {
                    // log4n.object(datas, 'datas');
                    if (typeof datas === 'undefined') {
                        reject(errorparsing({error_code: 500}));
                        log4n.debug('done - no data')
                    } else {
                        if (typeof datas.error_code === 'undefined') {
                            var result = read(datas);
                            // log4n.object(result, 'result');
                            resolve(result);
                            log4n.debug('done - ok');
                        } else {
                            reject(errorparsing(datas));
                            log4n.debug('done - error')
                        }
                    }
                })
                .catch(error => {
                    if (typeof error === 'undefined') error = {error_code: 500};
                    log4n.object(error, 'error');
                    reject(errorparsing(error));
                    log4n.debug('done - global catch')
                });
        }
    });
};
