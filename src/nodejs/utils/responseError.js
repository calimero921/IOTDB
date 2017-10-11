/**
 * Created by bede6362 on 31/05/2017.
 */

'use strict';

const Log4n = require('./log4n.js');

module.exports = function (content, response, logger) {
    const log4n = new Log4n('/utils/responseError');
    log4n.object(content, "content");

    if(typeof content.error === 'undefined') {
        logger.error(content);
        response.status(500);
        response.send(content);
    } else {
        logger.error(content.error.message);
        response.status(content.error.code);
        response.send(content.error.message);
    }
};