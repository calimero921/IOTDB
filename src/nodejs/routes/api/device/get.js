const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const sessionGet = require('../../../models/api/device/get.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/device/get');
    // log4n.object(req.params.device_id,'device_id');
    var device_id = req.params.device_id;

    //traitement de recherche dans la base
    if (typeof device_id === 'undefined') {
        //aucun device_id
        var error = {error: {code: 400}};
        responseError(error, res, log4n);
        log4n.debug('done - missing parameter(device_id)');
    } else {
        //traitement de recherche dans la base
        var query = {device_id:device_id};
        sessionGet(query, 0, 0)
            .then(datas => {
                if (typeof datas === 'undefined') {
                    var error = {error: {code: 404}};
                    responseError(error, res, log4n);
                    log4n.debug('done - not found');
                } else {
                    // log4n.object(datas, 'datas');
                    res.status(200).send(datas);
                    log4n.debug('done - ok');
                }
            })
            .catch(error => {
                responseError(error, res, log4n);
                log4n.debug('done - global catch');
            });
    }
};
