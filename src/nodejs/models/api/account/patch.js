const Log4n = require('../../../utils/log4n.js');
const errorparsing = require('../../../utils/errorparsing.js');
const mongoClient = require('../../mongodbupdate.js');
const read = require('./read.js');
const prepare = require('./prepare.js');

module.exports = function (id, new_account) {
    const log4n = new Log4n('/models/api/account/patch');
    // log4n.object(id,'id');
    // log4n.object(new_account,'new_account');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof id === 'undefined' || typeof new_account === 'undefined') {
            reject(errorparsing({error_code: 400}));
            log4n.debug('done - missing paramater')
        } else {
            let query = {};
            query.account_id = id;
            let parameter = prepare(new_account);
            //au cas ou on usurperait le account
            parameter.account_id = id;
            // console.log('parameter:', parameter);
            mongoClient('account', query, parameter)
                .then(datas => {
                    console.log('datas :', datas);
                    if (typeof datas === 'undefined') {
                        reject(errorparsing({error_code: 500}));
                        log4n.debug('done - no data')
                    } else {
                        if (typeof datas.error_code === 'undefined') {
                            let result = read(datas);
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
                    log4n.object(error, 'error');
                    reject(errorparsing(error));
                    log4n.debug('done - global catch')
                });
        }
    });
};
