const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbinsert.js');
const devicePrepare = require('./prepare.js');
const deviceKeygen = require('./keygen.js');
const deviceRead = require('./read.js');

module.exports = function (session) {
    const log4n = new Log4n('/models/api/device/set');
    // log4n.object(session,'session');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        if (typeof session === 'undefined') {
            reject({error: {code: '400'}});
        } else {
            var query = devicePrepare(session);
            query.device_id = deviceKeygen();
            mongoClient('device', query)
                .then(datas => {
                    // console.log('datas: ', datas);
                    if (typeof datas === 'undefined') {
                        reject({error: {code: '500'}});
                        log4n.debug('done - no data');
                    } else {
                        var result = deviceRead(datas[0]);
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