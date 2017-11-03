const Log4n = require('./log4n.js');

module.exports = function (content, response, logger) {
    const log4n = new Log4n('/utils/responseError');
    // log4n.object(content, 'content');

    if(typeof content.error === 'undefined') {
        logger.error(content);
        response.status(500);
        response.send(content);
        log4n.debug('done');
    } else {
        var message = 'code: ';
        message += content.error.code;
        if(typeof content.error.message !== 'undefined') message += ' / message: ' + content.error.message;
        logger.error(message);
        response
            .status(content.error.code)
            .send(content.error.message);
        log4n.debug('done');
    }
};