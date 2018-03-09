const Moment = require('moment');
const Log4n = require('../../../utils/log4n.js');
const errorparsing = require('../../../utils/errorparsing.js');
const Ajv = require('ajv');

function Converter() {
}

Converter.prototype.json2db = function (data) {
    const log4n = new Log4n('/models/api/account/converter/json2db');
    // log4n.object(data,'data');

    return new Promise(function (resolve, reject) {
        try {
            let result = {};
            let ajv = new Ajv();
            require('ajv-async')(ajv);

            let jsonSchema = {
                "$async": true,
                "type": "object",
                "properties": {
                    "firstname": {"type": "string"},
                    "lastname": {"type": "string"},
                    "email": {"type": "string"},
                    "password": {"type": "string"}
                },
                "required": ["firstname", "lastname", "email", "password"]
            };

            // log4n.object(jsonSchema, 'jsonSchema');
            let validate = ajv.compile(jsonSchema);

            validate(data)
                .then(valid => {
                    // log4n.object(valid, 'valid');
                    if (typeof data !== 'undefined') {
                        if (typeof valid.firstname !== 'undefined') result.firstname = valid.firstname;
                        if (typeof valid.lastname !== 'undefined') result.lastname = valid.lastname;
                        if (typeof valid.email !== 'undefined') result.email = valid.email;
                        if (typeof valid.password !== 'undefined') result.password = valid.password;
                    }

                    log4n.object(result, 'result');
                    log4n.debug('done - ok');
                    resolve(result);
                })
                .catch(error => {
                    log4n.object(error, 'error');
                    reject(errorparsing({
                        error_code: 500,
                        error_message: error.message + " (" + error.errors[0].dataPath + " " + error.errors[0].message + ")"
                    }));
                    log4n.debug('done - promise catch');
                });
        } catch (error) {
            log4n.object(error, 'error');
            reject(errorparsing(error));
            log4n.debug('done - global catch');
        }
    });
};

Converter.prototype.db2json = function (data) {
    const log4n = new Log4n('/models/api/account/converter/db2json');
    // log4n.object(data, 'data');

    return new Promise(function (resolve, reject) {
        try {
            let result = {};
            let ajv = new Ajv();
            require('ajv-async')(ajv);

            let dbSchema = {
                "$async": true,
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "firstname": {"type": "string"},
                    "lastname": {"type": "string"},
                    "email": {"type": "string"},
                    "password": {"type": "string"},
                    "creation_date": {"type": "integer"},
                    "last_connexion_date": {"type": "integer"}
                },
                "required": ["id", "firstname", "lastname", "email", "password", "creation_date", "last_connexion_date"]
            };
            // log4n.object(dbSchema, 'dbSchema');
            let validate = ajv.compile(dbSchema);

            log4n.debug('validation schema');
            validate(data)
                .then(valid => {
                    // log4n.object(valid, 'valid');
                    if (typeof valid.id !== 'undefined') result.id = valid.id;
                    if (typeof valid.firstname !== 'undefined') result.firstname = valid.firstname;
                    if (typeof valid.lastname !== 'undefined') result.lastname = valid.lastname;
                    if (typeof valid.email !== 'undefined') result.email = valid.email;
                    if (typeof valid.password !== 'undefined') result.password = valid.password;
                    if (typeof valid.creation_date !== 'undefined') result.creation_date = valid.creation_date;
                    if (typeof valid.last_connexion_date !== 'undefined') result.last_connexion_date = valid.last_connexion_date;

                    // log4n.object(result, 'result');
                    resolve(result);
                    log4n.debug('done - ok');
                })
                .catch(error => {
                    log4n.object(error, 'error');
                    reject(errorparsing({
                        error_code: 500,
                        error_message: error.message + " (" + error.errors[0].dataPath + " " + error.errors[0].message + ")"
                    }));
                    log4n.debug('done - promise catch');
                });
        } catch (error) {
            log4n.object(error, 'error');
            reject(errorparsing(error));
            log4n.debug('done - global catch');
        }
    });
};

module.exports = Converter;