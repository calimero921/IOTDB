const devicePost = require('./api/device/post.js');
const deviceGet = require('./api/device/get.js');

module.exports = function (app) {
    app.post('/v1/device', (req, res) => {devicePost(req, res)});
    app.get('/v1/device/:device_id', (req, res) => {deviceGet(req, res)});
};
