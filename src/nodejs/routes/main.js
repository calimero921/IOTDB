/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

var index = require('./index');
var users = require('./users');

module.exports = function (app) {
    app.use('/', index);
    app.use('/users', users);
};
