const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const sessionDelete = require('../../../models/api/account/delete.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/account/delete');
    // log4n.object(req.params.account_id,'id');

    let id = req.params.account_id;

    //traitement de recherche dans la base
    if (typeof id === 'undefined') {
        //aucun id
        responseError({error_code: 400}, res, log4n);
    } else {
        //traitement de suppression dans la base
        sessionDelete(id)
            .then(datas => {
                // log4n.object(datas, 'datas');
                if (typeof datas === 'undefined') {
                    //aucune données recue du processus d'enregistrement
                    responseError({error_code: 404}, res, log4n);
                    log4n.debug('done - no data');
                } else {
                    if (typeof datas.error_code === 'undefined') {
                        res.status(204).send();
                        log4n.debug('done - ok');
                    } else {
                        responseError(datas, res, log4n);
                        log4n.debug('done - response error');
                    }
                }
            })
            .catch(error => {
                responseError(error, res, log4n);
                log4n.debug('done');
            });
    }
};