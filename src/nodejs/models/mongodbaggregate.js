const mongodb = require('mongodb');
const Log4n = require('../utils/log4n.js');
const mongodbconf = require('../config/mongodb.js');

module.exports = function (collection, query, parameter, overtake) {
    const log4n = new Log4n('/models/mongodbaggregate');
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
                log4n.debug('MongoDB find');
                mdbcollection.aggregate(query, (err, datas) => {
                    // console.log('datas:', datas);
                        db.close();
                        if (typeof datas === 'undefined') {
                            reject({error: {code: 500}});
                            log4n.debug('done - no data');
                        } else {
                            if (datas.length > 0) {
                                var result = [];
                                // log4n.debug('nb result:' + datas.length);
                                for (var i = 0; i < datas.length; i++) {
                                    result.push(datas[i]);
                                }
                                // log4n.object(result, 'result');
                                resolve(result);
                                log4n.debug('done - ok');
                            } else {
                                if (overtake) {
                                    resolve([]);
                                    log4n.debug('done - no result but ok');
                                } else {
                                    reject({error: {code: 404}});
                                    log4n.debug('done - not found');
                                }
                            }
                        }
                    });
            })
            .catch(error => {
                if (typeof error === 'undefined') error = {error:{code:500}};
                log4n.object(error, 'error');
                reject(error);
                log4n.debug('done - global catch');
            });
    });
};