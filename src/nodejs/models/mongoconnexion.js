const Log4n = require('../utils/log4n.js');
const errorparsing = require('../utils/errorparsing.js');
const mongodb = require('mongodb');
const mongodbconf = require('../config/mongodb.js');

module.exports = function () {
    const log4n = new Log4n('/models/mongoconnexion');

    return new Promise(function (resolve, reject) {
        // if (globalConnection !== null) globalConnection.close();
        // console.log('globalConnection:', globalConnection);
        if (globalConnection === null) {
            let url = mongodbconf.url;
            let mongoClient = mongodb.MongoClient;

            mongoClient.connect(url)
                .then(client => {
                    log4n.debug('Connected successfully to server');
                    globalConnection = client.db(mongodbconf.dbName);
                    resolve();
                    log4n.debug('done - ok (new)');
                })
                .catch(error => {
                    log4n.object(error, 'error');
                    reject(errorparsing(error));
                    globalConnection = null;
                    log4n.debug('done - global catch');
                });
        } else {
            resolve();
            log4n.debug('done - ok (reuse)');
        }
    });
};