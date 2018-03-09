/**
 * Created by bede6362 on 06/06/2017.
 */

"use strict";

const Log4n = require('./log4n');
const getUsersBySession = require('../models/api/users/getBySession');

module.exports = function (req, res, admin) {
    const log4n = new Log4n('/utils/getconfig');
    if(typeof admin === 'undefined') admin = false;

    var config = {};

    return new Promise((resolve, reject) => {
        var session = req.session;
        if (typeof session === 'undefined') {
            log4n.debug("No session available");
            reject('401 Unauthorized');
        } else {
            log4n.debug("Session:" + session.id);
            getUsersBySession(session.id)
                .then(result => {
                    // log4n.object(result, 'result');
                    if (result.length > 0) {
                        config.user = result[0];
                        if((admin === true) && (result[0].admin === false)) {
                            log4n.debug("User haven't sufficient right to access this page");
                            reject('403 Forbidden');
                        } else {
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