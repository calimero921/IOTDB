const uuid = require('uuid');
const Log4n = require('../../../utils/log4n.js');

module.exports = function () {
    const log4n = new Log4n('/models/api/account/keygen');
    var node = [];

    for(var i=0; i<6; i++) {
        node.push(parseInt(Math.floor(Math.random()*16)), 16);
    }
    // log4n.object(node, 'node');

    var data = uuid.v1({node: node});
    // log4n.object(data, 'data');

    log4n.debug('done - ok');
    return data;
};
