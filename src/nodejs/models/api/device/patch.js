const Log4n = require('../../../utils/log4n.js');
const mongoClient = require('../../mongodbreplace.js');
const sessionRead = require('./read.js');
const sessionPrepare = require('./prepare.js');

module.exports = function (session_id, new_session) {
    const log4n = new Log4n('/models/api/sessions/patch');
    // log4n.object(session_id,'session_id');
    // log4n.object(new_session,'new_session');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof session_id === 'undefined' || typeof new_session === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing paramater')
        } else {
            var query = {};
            query.session_id = session_id;
            var parameter = sessionPrepare(new_session);
            //au cas ou on usurperait la session
            parameter.session_id = session_id;
            mongoClient('session', query, parameter)
                .then(datas => {
                    // console.log('datas :', datas);
                    if (typeof datas === 'undefined') {
                        reject({error: {code: 500}});
                        log4n.debug('done - no data')
                    } else {
                        if (typeof datas.code === 'undefined') {
                            var result = sessionRead(datas);
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
