const Log4n = require('../utils/log4n.js');
const server = require('../config/server.js');

const accountPost = require('./api/account/post.js');
const accountGet = require('./api/account/get.js');
const accountDelete = require('./api/account/delete.js');
const accountPatch = require('./api/account/patch.js');

// const getUsersCheck = require('./api/users/check');
// const getUsersByEmail = require('./api/users/getByEmail');
// const getUsersBySession = require('../models/api/users/getBySession');
// const recoverUser = require('./api/users/recover');
// const setUsers = require('./api/users/post');
// const setUsersPassword = require('./api/users/setPassword');
// const deleteUsers = require('./api/users/delete');

const devicePost = require('./api/device/post.js');
const deviceGet = require('./api/device/get.js');
const deviceDelete = require('./api/device/delete.js');
const devicePatch = require('./api/device/patch.js');

//routage des pages
// const index = require('./index');

module.exports = function (app) {
    const log4n = new Log4n('/routes/main');
    // Routage des pages
    // app.get('/', checkAuth, function (req, res) {index(req, res)});

    app.get('/status', (req, res) => {res.status(200).send({'swagger_version':server.swagger, 'last_update':server.date})});

    // routages des API
    app.post('/v1/account', (req, res) => {accountPost(req, res)});
    app.get('/v1/account/:account_id', (req, res) => {accountGet(req, res)});
    app.delete('/v1/account/:account_id', (req, res) => {accountDelete(req, res)});
    app.patch('/v1/account/:account_id', (req, res) => {accountPatch(req, res)});

    // app.get('/v1/user/check/:email/:password', function (req, res) {getUsersCheck(req, res)});
    // app.get('/v1/user/email/:email', checkAuth, function (req, res) {getUsersByEmail(req, res)});
    // app.get('/v1/user/recover/:email', function (req, res) {recoverUser(req, res)});
    // app.delete('/v1/user/:email', checkAuth, function (req, res) {deleteUsers(req, res)});
    // app.post('/v1/user', checkAuth, function (req, res){setUsers(req, res);});
    // app.post('/v1/user/password', function (req, res){setUsersPassword(req, res);});

    app.post('/v1/device', (req, res) => {devicePost(req, res)});
    app.get('/v1/device/:device_id', (req, res) => {deviceGet(req, res)});
    app.delete('/v1/device/:device_id', (req, res) => {deviceDelete(req, res)});
    app.patch('/v1/device/:device_id', (req, res) => {devicePatch(req, res)});
};

// function checkAuth(req, res, next) {
//     const log4n = new Log4n('/routes/main/checkauth');
//     log4n.object(req.session, 'session');
//
//     var config = {};
//     config.title = "Signin";
//
//     if (typeof req.session === 'undefined') {
//         log4n.info('error no session found');
//         res.render('identity/signin/index.html', config);
//     } else {
//         // log4n.object(req.session, 'session');
//         getUsersBySession(req.session.id)
//             .then(result => {
//                 if(result.length>0) {
//                     log4n.debug('session found');
//                     next();
//                 } else {
//                     log4n.info('no user currently associated to this session');
//                     res.render('identity/signin/index.html', config);
//                 }
//             })
//             .catch(err => {
//                 log4n.info('error getting session information');
//                 res.render('identity/signin/index.html', config);
//             });
//     }
// }