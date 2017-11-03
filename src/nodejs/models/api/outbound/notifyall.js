const Log4n = require('../../../utils/log4n.js');
const notificationRead = require('../notification/read.js');
const notificationDistinct = require('../notification/distinct.js');
const send = require('./send.js');

module.exports = function (session_array) {
    const log4n = new Log4n('/models/api/outbound/notifyall');
    // log4n.object(session_array,'session_array');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof session_array === 'undefined') {
            reject({error: {code: 400}});
            log4n.debug('done - missing parameter(session_array)');
        } else {
            if (session_array.length > 0) {
                var content = {delete: session_array};
                // log4n.object(content, 'content');

                notificationDistinct()
                    .then(datas => {
                        log4n.object(datas,'datas');
                        if (typeof datas === 'undefined') {
                            resolve();
                            log4n.debug('done - no one to notify');
                        } else {
                            // console.log('datas :', datas);
                            if (datas.length > 0) {
                                //creation du tableau de promise
                                var sendall = [];
                                for (var i = 0; i < datas.length; i++) {
                                    var notification = notificationRead(datas[i]);
                                    // log4n.object(notification, 'notification');
                                    sendall.push(send(notification, 'POST', content));
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
                                    log4n.debug('done - no promise');
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
            } else {
                resolve();
                log4n.debug('done - no content to send');
            }
        }
    });
};