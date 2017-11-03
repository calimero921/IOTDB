const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbfind.js');
const readsession = require('./read.js');

module.exports = function (user_id) {
    const log4n = new Log4n('/models/api/sessions/getuser');
    // log4n.object(user_id, 'user_id');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof user_id === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing paramater');
        } else {
            var query = {};
            query.user_id = user_id;
            mongoClient('session', query)
                .then(datas => {
                    if (datas.length > 0) {
                        var result = [];
                        for (var i = 0; i < datas.length; i++) {
                            result.push(readsession(datas[i]));
                        }
                        // log4n.object(result, 'result');
                        resolve(result);
                        log4n.debug('done - ok');
                    } else {
                        reject({error: {code: 404}});
                        log4n.debug('done - not found');
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
