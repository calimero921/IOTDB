/* GET rechercher page. */

"use strict";

const Log4n = require('../utils/log4n');
const getConfig = require('../utils/getconfig.js');

const getUsersAll = require('../models/api/users/getAll.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/amin_user');

    var config = {};
    config.title = 'Error';

    try {
        getConfig(req, res, true)
            .then(data => {
                // log4n.object(data, 'config');
                if (typeof data === 'undefined') throw 'no config available';
                config = data;
                config.title = 'Users management';

                return getUsersAll(req, res);
            })
            .then(data => {
                // log4n.object(data, 'users');
                if (typeof data === 'undefined') {
                    config.users = [];
                } else {
                    config.users = data;
                }

                // log4n.object(config, 'config');
                res.render('admin/user/index.html', config);
            })
            .catch(error => {
                log4n.error(error);
                config.message = error;
                res.render('error.html', config);
            });
    } catch (error) {
        log4n.error(error);
        config.message = error;
        res.render('error.html', config);
    }
};