const Log4n = require('../../../utils/log4n.js');
const notificationGetAll = require('../notification/getsession.js');
const notificationRead = require('../notification/read.js');
const expire = require('./expire.js');
const send = require('./send.js');

module.exports = function (session_id) {
    const log4n = new Log4n('/models/api/outbound/notifyone');
    // log4n.object(session_id,'session_id');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof session_id === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing parameter (session_id)');
        } else {
            var parameter = {offset: 0, limit: 0};
            notificationGetAll(session_id, parameter, true)
                .then(datas => {
                    if (typeof datas === 'undefined') {
                        reject({error: {code: 500}});
                        log4n.debug('done - no data');
                    } else {
                        // console.log('datas :', datas);
                        if (datas.length > 0) {
                            //creation du tableau de promise
                            var sendall = [];
                            for (var i = 0; i < datas.length; i++) {
                                var notification = notificationRead(datas[i]);
                                // log4n.object(notification, 'notification');

                                if (!expire(notification.notification_expiration_date)) {
                                    sendall.push(send(notification, 'PATCH'));
                                } else {
                                    log4n.debug('expire');
                                }
                            }
                            //execution des promises et attente du résultat
                            if (sendall.length > 0) {
                                Promise.all(sendall)
                                    .then(() => {
                                        resolve();
                                        log4n.debug('done - ok');
                                    })
                                    .catch((error) => {
                                        if (typeof error === 'undefined') error = {error: {code: 500}};
                                        log4n.object(error, 'error');
                                        reject(error);
                                        log4n.debug('done - inner catch')
                                    });
                            } else {
                                resolve();
                                log4n.debug('done - no notification found');
                            }
                        } else {
                            resolve();
                            log4n.debug('done - no data');
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