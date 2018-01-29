const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbinsert.js');
const prepare = require('./prepare.js');
const keygen = require('./keygen.js');
const read = require('./read.js');

module.exports = function (device) {
    const log4n = new Log4n('/models/api/device/set');
    log4n.object(device, 'device');

    log4n.log('storing device');
    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        log4n.log('storing device');
        if (typeof device === 'undefined') {
            log4n.log('error, no data');
            reject({error: {code: '400'}});
        } else {
            log4n.log('preparing datas');
            var query = prepare(account);
            query.device_id = keygen();
            query.device_creation_date = parseInt(moment().format('x'));
            log4n.object(query, 'query');
            mongoClient('device', query)
                .then(datas => {
                    // console.log('datas: ', datas);
                    if (typeof datas === 'undefined') {
                        reject({error: {code: '500'}});
                        log4n.debug('done - no data');
                    } else {
                        var result = read(datas[0]);
                        // log4n.object(result, 'result');
                        resolve(result);
                        log4n.debug('done - ok');
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