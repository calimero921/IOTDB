const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const sessionDelete = require('../../../models/api/sessions/delete.js');
const notificationDeleteSession = require('../../../models/api/notification/deletesession.js');
const notificationDelete = require('../../../models/api/outbound/notifyone.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/sessions/delete');
    // log4n.object(req.params.session_id,'session_id');

    var session_id = req.params.session_id;

    //traitement de recherche dans la base
    if (typeof session_id === 'undefined') {
        //aucun session_id
        var error = {error: {code: 400}};
        responseError(error, res, log4n);
    } else {
        //traitement de suppression dans la base
        var status = 500;
        var session = {};
        sessionDelete(session_id)
            .then(datas => {
                // log4n.object(datas, 'datas');
                if (typeof datas === 'undefined') {
                    return {error: {code: 404}};
                } else {
                    status = 204;
                    session = datas;
                    return notificationDelete(session_id, 'DELETE');
                }
            })
            .then(() => {
                //suppression des notification associées
                return notificationDeleteSession(session_id);
            })
            .then(datas => {
                //log4n.object(datas, 'datas');
                if (typeof datas === 'undefined') {
                    responseError({error: {code: 500}}, res, log4n);
                    log4n.debug('done');
                } else {
                    if (typeof datas.error === 'undefined') {
                        res.status(status).send();
                        log4n.debug('done');
                    } else {
                        responseError(datas.error, res, log4n);
                        log4n.debug('done');
                    }
                }
            })
            .catch(error => {
                responseError(error, res, log4n);
                log4n.debug('done');
            });
    }
};