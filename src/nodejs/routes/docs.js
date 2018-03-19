const Log4n = require('../utils/log4n.js');
const getConfig = require('../utils/getconfig.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/index');

    let config = {title: "Error"};
    try {
        getConfig(req, res, false)
            .then(data => {
                log4n.object(data, 'config');
                if (typeof data === 'undefined') throw 'no config available';
                config = data;
                config.title = req.t('docs:title');

                log4n.object(config, 'config');
                res.render('index/index.html', config);
            })
            .catch(error => {
                log4n.error(error);
                config.message = error.error_code + " " + error.error_message;
                res.render('error.html', config);
            });
    } catch (error) {
        log4n.error(error);
        config.message = error.error_code + " " + error.error_message;
        res.render('error.html', config);
    }
};