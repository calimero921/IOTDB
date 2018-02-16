const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');
const errorparsing = require('../../../utils/errorparsing.js');
const mongoClient = require('../../mongodbinsert.js');
const prepare = require('./prepare.js');
const keygen = require('./keygen.js');
const read = require('./read.js');

module.exports = function (account) {
    const log4n = new Log4n('/models/api/account/set');
    // log4n.object(account, 'account');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        if (typeof account === 'undefined') {
            reject(errorparsing({error_code: '400'}));
            log4n.debug('done - missing parameter (account)');
        } else {
            var query = prepare(account);
            query.account_id = keygen();
            query.account_creation_date = parseInt(moment().format('x'));
            mongoClient('account', query)
                .then(datas => {
                    // console.log('datas: ', datas);
                    if (typeof datas === 'undefined') {
                        reject(errorparsing({error_code: '500'}));
                        log4n.debug('done - no data');
                    } else {
                        var result = read(datas[0]);
                        // log4n.object(result, 'result');
                        resolve(result);
                        log4n.debug('done - ok');
                    }
                })
                .catch(error => {
                    log4n.object(error, 'error');
                    reject(errorparsing(error));
                    log4n.debug('done - global catch')
                });
        }
    });
};