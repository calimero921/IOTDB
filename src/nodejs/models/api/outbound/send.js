const https = require('https');
const parseUri = require('url').parse;
const Log4n = require('../../../utils/log4n.js');

module.exports = function (notification, verb, content) {
    const log4n = new Log4n('/models/api/outbound/send');
    // log4n.object(notification,'notification');
    // log4n.object(verb,'verb');

    //traitement de recherche dans la base
    return new Promise(function (resolve, reject) {
        if (typeof notification === 'undefined') {
            reject({error:{code:400}});
            log4n.debug('done - missing parameter (notification)');
        } else {
            if (typeof verb === 'undefined') {
                reject({error:{code:400}});
                log4n.debug('done - missing paramater (verb)');
            } else {
                var jsonObject = {};
                log4n.debug('sending notification');
                var uri;
                var header;
                switch (verb.toUpperCase()) {
                    case 'POST':
                        uri = notification.notification_uri + '/sessions';
                        jsonObject = JSON.stringify(content);
                        header = {
                            'x-sessionmanager-key': notification.notification_credentials,
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(jsonObject),
                            'Accept': 'application/json'
                        };
                        break;
                    case 'PATCH':
                    case 'DELETE':
                    default:
                        uri = notification.notification_uri + '/sessions/' + notification.session_id;
                        header = {
                            'x-sessionmanager-key': notification.notification_credentials,
                            'Accept': 'application/json'
                        };
                        break;
                }
                var options = parseUri(uri);
                options.method = verb.toUpperCase();
                options.headers = header;
                // console.log('options:', options);
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                var result = {};
                const req = https.request(options, (res) => {
                    // log4n.debug('STATUS: ' + res.statusCode);
                    // log4n.debug('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        // log4n.debug('BODY: ' + chunk);
                        result += chunk;
                    });
                    res.on('end', (chunk) => {
                        if (typeof chunk !== 'undefined') result += chunk;
                        resolve(result);
                        log4n.debug('done - ok');
                    });
                    res.on('error', error => {
                        log4n.error(`problem with response: ${error.message}`);
                        reject(error);
                        log4n.debug('done - http response error');
                    });
                });
                req.on('error', error => {
                    log4n.error(`problem with request: ${error.message}`);
                    reject(error);
                    log4n.debug('done - http request error');
                });
                if (typeof jsonObject !=='undefined') req.write(jsonObject);
                req.end();
            }
        }
    });
};
