const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const decodePost = require('../../../utils/decodePost.js');
const sessionPatch = require('../../../models/api/sessions/patch.js');
const notificationPatch = require('../../../models/api/outbound/notifyone.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/sessions/patch');
    // log4n.object(req.params.session_id,'session_id');

    var session_id = req.params.session_id;

    decodePost(req, res)
        .then(datas => {
            // log4n.object(datas, 'datas');
            var status = 500;
            var session = {};
            sessionPatch(session_id, datas)
                .then(datas => {
                    // log4n.object(datas, 'datas');
                    if (typeof datas === 'undefined') {
                        return {error:{code:500}};
                    } else {
                        status = 200;
                        session = datas;
                        return notificationPatch(session_id, 'PATCH');
                    }
                })
                .then((datas) => {
                    if (typeof datas === 'undefined') {
                        res.status(status).send(session);
                        log4n.debug('done');
                    } else {
                        responseError(datas, res, log4n);
                        log4n.debug('done');
                    }
                })
                .catch(error => {
                    responseError(error, res, log4n);
                    log4n.debug('done');
                });
        })
        .catch(error => {
            responseError(error, res, log4n);
            log4n.debug('done');
        });
};
