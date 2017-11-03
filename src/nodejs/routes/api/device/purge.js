const moment = require('moment');
const Log4n = require('../../../utils/log4n.js');
const sessionGet = require('../../../models/api/sessions/get.js');
const sessionNotifyAll = require('../../../models/api/outbound/notifyall.js');
const notificationDeleteAll = require('../../../models/api/notification/deleteall.js');
const sessionDeleteAll = require('../../../models/api/sessions/deleteall.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/sessions/purge');

    //traitement de suppression dans la base
    return new Promise(function (resolve, reject) {
        var now = moment();
        // log4n.object(parseInt(now.format('x')), 'now');

        //recherche des sessions avec offset et limit
        var query = {expiration_date: {$lt: parseInt(now.format('x'))}};
        var session_array = [];
        sessionGet(query, 0, 0, true)
            .then(datas => {
                if (typeof datas === 'undefined') {
                    return {error: {code: 500}};
                } else {
                    for (var i = 0; i < datas.length; i++) {
                        session_array.push(datas[i].session_id);
                    }
                    // log4n.object(session_array, 'session_array');
                    if (session_array.length > 0) return sessionNotifyAll(session_array);
                    log4n.debug('nothing to notify');
                    return;
                }
            })
            .then((datas) => {
                if (typeof datas === 'undefined') {
                    if (session_array.length > 0) return notificationDeleteAll(session_array);
                    log4n.debug('no notification to delete');
                    return;
                } else {
                    return datas;
                }
            })
            .then((datas) => {
                if (typeof datas === 'undefined') {
                    if (session_array.length > 0) return sessionDeleteAll(session_array);
                    log4n.debug('no session to delete');
                    return;
                } else {
                    return datas;
                }
            })
            .then((datas) => {
                // console.log('session delete all datas:', typeof datas);
                if (typeof datas === 'undefined') {
                    resolve();
                    log4n.debug('done - ok');
                } else {
                    if (typeof datas.code === 'undefined') {
                        reject({error: {code: 500}});
                        log4n.debug('done - unmanaged error');
                    } else {
                        reject(datas);
                        log4n.debug('done - error');
                    }
                }
            })
            .catch(error => {
                log4n.object(error, 'error');
                reject(error);
                log4n.debug('done - global catch');
            })
    });
};