const Log4n = require('../../../utils/log4n.js');
const set = require('../../../models/api/device/set.js');

module.exports = function (content) {
    const log4n = new Log4n('/routes/api/device/register');
    // log4n.object(datas, 'datas');

    //traitement d'enregistrement dans la base
    return new Promise(function (resolve, reject) {
        if (typeof content === 'undefined') {
            //aucune donnée postée
            log4n.debug('done - no data');
            reject({error: {code: 400}});
        }
        //lecture des données postées
        set(content)
            .then(datas => {
                console.log('datas:', datas);
                if (typeof datas === 'undefined') {
                    //aucune données recue du processus d'enregistrement
                    log4n.debug('done - no data');
                    reject({error: {code: 500}});
                } else {
                    //recherche d'un code erreur précédent
                    if (typeof datas.code === 'undefined') {
                        //notification enregistrée
                        log4n.debug('done - ok');
                        resolve();
                    } else {
                        //erreur dans le processus d'enregistrement de la notification
                        log4n.debug('done - response error');
                        reject({error: {code: datas.code}});
                    }
                }
            })
            .catch(error => {
                log4n.debug('done - global catch');
                reject({error: {code: error}});
            });
    });
};
