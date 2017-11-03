const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbupdate.js');
const read = require('./read.js');
const prepare = require('./prepare.js');

module.exports = function (device_id, new_device) {
    const log4n = new Log4n('/models/api/device/patch');
    // log4n.object(device_id,'device_id');
    // log4n.object(new_device,'new_device');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof device_id === 'undefined' || typeof new_device === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing paramater')
        } else {
            var query = {};
            query.device_id = device_id;
            var parameter = prepare(new_device);
            //au cas ou on usurperait le device
            parameter.device_id = device_id;
            mongoClient('device', query, parameter)
                .then(datas => {
                    // console.log('datas :', datas);
                    if (typeof datas === 'undefined') {
                        reject({error: {code: 500}});
                        log4n.debug('done - no data')
                    } else {
                        if (typeof datas.code === 'undefined') {
                            var result = read(datas);
                            // log4n.object(result, 'result');
                            resolve(result);
                            log4n.debug('done - ok');
                        } else {
                            reject(datas);
                            log4n.debug('done - error')
                        }
                    }
                })
                .catch(error => {
                    if (typeof error === 'undefined') error = {error: {code: 500}};
                    log4n.object(error, 'error');
                    reject(error);
                    log4n.debug('done - global catch')
                });
        }
    });
};
