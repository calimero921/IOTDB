const configMQTT = require('../config/mqtt.js');
const Log4n = require('../utils/log4n.js');
const mqtt = require('mqtt');
const checkJSON = require('../utils/checkJSON.js');
const mqttroute = require('./mqttroute.js')

const log4n = new Log4n('/MQTTEngine');
let clientMQTT = {};
let mqttURL = {};

function MQTTEngine() {
    mqttURL = 'mqtt://' + configMQTT.server + ':' + configMQTT.port
}

module.exports = MQTTEngine;

MQTTEngine.prototype.start = function() {
    clientMQTT = mqtt.connect(mqttURL);
    clientMQTT.on('connect', onConnect);
    clientMQTT.on('reconnect', onReconnect);
    clientMQTT.on('close', onClose);
    clientMQTT.on('offline', onOffline);
    clientMQTT.on('error', onError);
    clientMQTT.on('message', onMessage);
    clientMQTT.on('packetsend', onPacketSend);
    clientMQTT.on('packetreceive', onPacketReceived);
};

MQTTEngine.prototype.stop = function() {
    clientMQTT.end();
};

/**
 *
 */
function onConnect() {
    log4n.debug('MQTT client connecting');
    clientMQTT.subscribe(configMQTT.topic_system);
    clientMQTT.subscribe(configMQTT.topic_register);
    log4n.debug('MQTT client connected');
}

/**
 *
 */
function onReconnect() {
    log4n.debug('MQTT client reconnecting');
    log4n.debug('MQTT client reconnected');
}

/**
 *
 */
function onClose() {
    log4n.debug('MQTT client closing');
    log4n.debug('MQTT client closed');
}

/**
 *
 */
function onOffline() {
    log4n.debug('MQTT client offlining');
    log4n.debug('MQTT client offlined');
}

/**
 *
 */
function onError(error) {
    log4n.debug('MQTT client error');
    console.log('error: ' + error);
    log4n.debug('MQTT client error');
}

/**
 *
 */
function onMessage(topic, message, packet) {
    log4n.debug('MQTT client message starting');
    // log4n.object(topic, 'topic');
    // log4n.object(message.toString(), 'message');
    // log4n.object(packet, 'packet');

    let result = checkJSON(message);
    log4n.object(result, 'result');

    mqttroute(topic, result);
    log4n.debug('MQTT client message done');
}

/**
 *
 */
function onPacketSend(packet) {
    // log4n.debug('MQTT client sending packet');
    // log4n.object(packet, 'packet');
    // log4n.debug('MQTT client sent packet');
}

/**
 *
 */
function onPacketReceived(packet) {
    // log4n.debug('MQTT client receiving packet');
    // log4n.object(packet, 'packet');
    // log4n.debug('MQTT client received packet');
}
