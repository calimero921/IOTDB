const server = require('../config/server.js');

// const accountPost = require('./api/account/post.js');
// const accountGet = require('./api/account/get.js');
// const accountDelete = require('./api/account/delete.js');
// const accountPatch = require('./api/account/patch.js');

// const devicePost = require('./api/device/post.js');
// const deviceGet = require('./api/device/get.js');
// const deviceDelete = require('./api/device/delete.js');
// const devicePatch = require('./api/device/patch.js');

module.exports = function (app) {
    app.get('/', (req, res) => {res.status(200).send({'swagger_version':server.swagger, 'last_update':server.date})});

    // app.post('/v1/account', (req, res) => {accountPost(req, res)});
    // app.get('/v1/account/:account_id', (req, res) => {accountGet(req, res)});
    // app.delete('/v1/account/:account_id', (req, res) => {accountDelete(req, res)});
    // app.patch('/v1/account/:account_id', (req, res) => {accountPatch(req, res)});

    // app.post('/v1/device', (req, res) => {devicePost(req, res)});
    // app.get('/v1/device/:device_id', (req, res) => {deviceGet(req, res)});
    // app.delete('/v1/device/:device_id', (req, res) => {deviceDelete(req, res)});
    // app.patch('/v1/device/:device_id', (req, res) => {devicePatch(req, res)});
};
