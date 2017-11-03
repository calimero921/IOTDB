const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbdelete.js');

module.exports = function (session_id) {
    const log4n = new Log4n('/models/api/sessions/delete');
    // log4n.object(session_id,'session_id');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        var query = {};
        if(typeof session_id === 'undefined') {
            reject({error:{code:400}});
            log4n.debug('done - missing paramater');
        } else {
            query.session_id = session_id;
            mongoClient('session', query)
                .then(datas => {
                    // log4n.object(datas, 'datas');
                    if (typeof datas === 'undefined') {
                        reject({error:{code:500}});
                        log4n.debug('done - no reult');
                    } else {
                        if (typeof datas.error === 'undefined') {
                            resolve(datas);
                            log4n.debug('done - ok');
                        } else {
                            reject(datas);
                            log4n.debug('done - response error');
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
