const mongodb = require('mongodb');
const Log4n = require('../utils/log4n.js');
const mongodbconf = require('../config/mongodb.js');

module.exports = function (collection, query) {
    const log4n = new Log4n('/models/mongodbdelete');
    // log4n.object(mongodbconf, 'mongodbconf');
    // log4n.object(collection, 'collection');
    // log4n.object(query, 'query');

    log4n.debug('running request');
    return new Promise(function (resolve, reject) {
        // log4n.debug('building database connection');
        var url = 'mongodb://' + mongodbconf.host + ':' + mongodbconf.port + '/' + mongodbconf.name;
        var mongoClient = mongodb.MongoClient;
        mongoClient.connect(url)
            .then(db => {
                log4n.debug('Connected successfully to server');
                var mdbcollection = db.collection(collection);
                log4n.debug('MongoDB Delete One');
                mdbcollection.findOneAndDelete(query)
                    .then(datas => {
                        // console.log('datas: ', datas);
                        if (typeof datas === 'undefined') {
                            reject({error: {code: 500}});
                            log4n.debug('done - no data');
                        } else {
                            if (datas.ok === 1) {
                                if (typeof datas.value === 'undefined' || datas.value === null) {
                                    reject({error: {code: 404}});
                                    log4n.debug('done - not found');
                                } else {
                                    resolve(datas.value);
                                    log4n.debug('done - ok');
                                }
                            } else {
                                reject({error: {code: 500}});
                                log4n.debug('done - response error');
                            }
                        }
                    });
            })
            .catch(error => {
                if (typeof error === 'undefined') error = {error: {code: 500}};
                log4n.object(error, 'error');
                reject(error);
                log4n.debug('done - global catch');
            });
    });
};