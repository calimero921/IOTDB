const Log4n = require('../utils/log4n');
const responseError = require('../utils/responseError.js');
const errorparsing = require('../utils/errorparsing.js');
const accountGetByToken = require('../models/api/account/getByToken.js');
const accountSetToken = require('../models/api/account/setToken.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/reset');
    log4n.object(req.params.email, 'email');
    log4n.object(req.params.token, 'token');

    let config = {title: 'Error'};
    accountGetByToken(req.params.email, req.params.token)
        .then(datas => {
            if(data.length > 0) {
                log4n.object(datas[0], 'users');
                config.person = datas[0];
                return accountSetToken(datas[0].email);
            }
            return errorparsing({error_code: 404, error_message: 'not found'});
        })
        .then(data => {
            log4n.object(data, 'result');
            if (typeof data === 'undefined') {
                responseError({error_code: 500, error_message: 'error updating token'}, res, log4n);
                log4n.debug('done - no data');
            } else {
                if (typeof data.error_code !== 'undefined') {
                    responseError(error, res, log4n);
                    log4n.debug('done - error');
                } else {
                    config.title = 'Reset password';
                    config.person.token = data.token;
                    log4n.object(config, 'config');
                    res.render('identity/reset/index.html', config);
                    log4n.debug('done - ok');
                }
            }
        })
        .catch(error => {
            log4n.object(error, 'error');
            responseError(error, res, log4n);
            log4n.debug('done - promise catch');
        });
};