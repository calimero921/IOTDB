const moment = require('moment');
const Log4n = require('./log4n');
const getUsersBySession = require('../models/api/account/getBySession');

module.exports = function (req, res, admin) {
    const log4n = new Log4n('/utils/getconfig');
    if(typeof admin === 'undefined') admin = false;

    let config = {};

    return new Promise((resolve, reject) => {
        let session_id = req.sessionID;
        if (typeof session_id === 'undefined') {
            log4n.debug("No session available");
            reject('401 Unauthorized');
        } else {
            log4n.debug("Session:" + session_id);
            getUsersBySession(session_id)
                .then(result => {
                    // log4n.object(result, 'result');
                    if (result.length > 0) {
                        config.user = result[0];
                        if((admin === true) && (result[0].admin === false)) {
                            log4n.debug("User haven't sufficient right to access this page");
                            reject('403 Forbidden');
                        } else {
                            let last = new moment(config.user.last_connexion_date);
                            config.user.last_connexion_date = last.format('DD/MMM/YYYY HH:mm:SS');
                            resolve(config);
                        }
                    } else {
                        log4n.debug("No user found for this session");
                        reject('401 Unauthorized');
                    }
                })
                .catch(error => {
                    log4n.error('error: ' + error);
                });
        }
    });
};