const Log4n = require('../../../utils/log4n.js');
const get = require('../../../models/api/device/get.js');
const set = require('../../../models/api/device/set.js');
const update = require('../../../models/api/device/patch.js');

module.exports = function (content) {
    const log4n = new Log4n('/routes/api/device/register');
    // log4n.object(content, 'content');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        if (typeof content === 'undefined') {
            //aucune donnée postée
            log4n.debug('done - no data');
            reject({code: 400});
        }

        let query={"device_serial_number": content.serial_number,
            "device_manufacturer": content.manufacturer};
        get(query, "", "", true)
            .then(result => {
                log4n.object(result, 'result');
                if (typeof result === 'undefined') {
                    //enregistrement des données postées
                    log4n.debug('inserting device');
                    return set(content);
                } else {
                    //enregistrement des données postées
                    log4n.debug('updating device');
                    return update(result[0].id, content);
                }
            })
            .then(datas => {
                // log4n.object(datas, 'datas');
                if (typeof datas === 'undefined') {
                    //aucune données recue du processus d'enregistrement
                    log4n.debug('done - no data');
                    reject({code: 500});
                } else {
                    //recherche d'un code erreur précédent
                    if (typeof datas.code === 'undefined') {
                        //notification enregistrée
                        log4n.debug('done - ok');
                        resolve();
                    } else {
                        //erreur dans le processus d'enregistrement de la notification
                        log4n.debug('done - response error');
                        reject({code: datas.code});
                    }
                }
            })
            .catch(error => {
                log4n.debug('done - global catch');
                reject({code: error});
            });
    });
};
