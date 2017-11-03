const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbfind.js');
const read = require('./read.js');

module.exports = function (query, offset, limit, overtake) {
    const log4n = new Log4n('/models/api/account/get');
    // log4n.object(query, 'query');
    // log4n.object(offset, 'offset');
    // log4n.object(limit, 'limit');
    // log4n.object(overtake, 'overtake');

    if (typeof overtake === 'undefined') overtake = false;

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        var parameter = {};
        if (typeof limit === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing parameter (limit)');
        } else {
            if (typeof offset !== 'undefined') parameter.offset = offset;
            parameter.limit = limit;
            mongoClient('account', query, parameter, overtake)
                .then(datas => {
                    var result = [];
                    if (datas.length > 0) {
                        for (var i = 0; i < datas.length; i++) {
                            result.push(read(datas[i]));
                        }
                        // log4n.object(result, 'result');
                        resolve(result);
                        log4n.debug('done - ok');
                    } else {
                        if (overtake) {
                            // log4n.debug('no result but ok');
                            resolve(result);
                            log4n.debug('done - no result but ok');
                        } else {
                            reject({error: {code: 404}});
                            log4n.debug('done - not found');
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
