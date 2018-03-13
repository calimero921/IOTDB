const Log4n = require('./log4n.js');

module.exports = function () {
    const log4n = new Log4n('/utils/password');

    const refstr = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let value = "";
    let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    while (!value.match(passw)) {
        value = "";
        for (let i = 0; i < 16; i++) {
            value += refstr.substr(Math.round(Math.random() * refstr.length), 1);
        }
    }
    return value;
};
