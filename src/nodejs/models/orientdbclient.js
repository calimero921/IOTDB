/**
 * Created by bede6362 on 31/05/2017.
 */
/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

const Log4n = require('../utils/log4n.js');
const orientdb = require('orientjs');
const orientdbconf = require('../config/orientdb.js');

module.exports = function (query) {
    const log4n = new Log4n('/models/orientdbclient');
    log4n.object(query, 'query');
    log4n.object(orientdbconf, 'orientdbconf');

    return new Promise(function (resolve, reject) {
        // log4n.debug('building database connection');
        var db = new orientdb.ODatabase(orientdbconf);

        // log4n.debug('running request');
        db.open()
            .then(function () {
                return db.query(query);
            })
            .then(function (result) {
                // log4n.debug('closing connection');
                db.close()
                    .then(function () {
                        log4n.debug("connection closed")
                    });

                // log4n.debug('resolving results');
                resolve(result);
            })
            .catch(function (error) {
                log4n.object(error, 'error');
                db.close()
                    .then(function () {
                        log4n.debug("connection closed")
                    });
                reject(error);
            });
    });
};