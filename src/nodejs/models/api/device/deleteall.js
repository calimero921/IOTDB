const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbdeleteall.js');

module.exports = function (session_array) {
    const log4n = new Log4n('/models/api/sessions/deleteall');
    // log4n.object(session_array,'session_array');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof session_array === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing paramater');
        } else {
            if (session_array.length > 0) {
                var query = {session_id: {$in: session_array}};
                mongoClient('session', query)
                    .then(datas => {
                        // log4n.object(datas, 'datas');
                        if (typeof datas === 'undefined') {
                            reject({error: {code: 500}});
                            log4n.debug('done - no data');
                        } else {
                            if (typeof datas.error === 'undefined') {
                                resolve();
                                log4n.debug('done - ok');
                            } else {
                                reject(datas);
                                log4n.debug('done - error');
                            }
                        }
                    })
                    .catch(error => {
                        if (typeof error === 'undefined') error = {error: {code: 500}};
                        log4n.object(error, 'error');
                        reject(error);
                        log4n.debug('done - global catch')
                    });
            } else {
                resolve();
                log4n.debug('done - no session to delete');
            }
        }
    });
};
