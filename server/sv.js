const { inspect } = require('util');
const WebSocketServer = require('websocket').server;
const http = require('http');
const mqtt = require('mqtt');
const logger = require('simple-fancy-logger')({ logString: "[TSTAMP] [LEVEL] [TEXT]", });
const handler = require('./handlers/ws');

const config = require('./config');
const mqttClient = mqtt.connect(config.mqtt.broker);

mqttClient.on('connect', function () {

  mqttClient.subscribe(config.mqtt.announceTopic), err => {
    if (err) logger.i(err);
  }

  mqttClient.subscribe('#', err => {
    if (err) logger.i(err);
  });

  mqttClient.subscribe('$SYS/mqttClients/#', err => {
    if (err) logger.i(err);
  });
});

mqttClient.on('error', function (err) {
  logger.e(err);
});

mqttClient.on('message', function (topic, message) {
  // message is Buffer
  logger.i(topic, message.toString());
});


logger.i(`starting ws server on port ${config.ws.port}`);

var server = http.createServer(function (request, response) {
  logger.i((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(config.ws.port, function () {
  logger.i(`listening on ${config.ws.port}`);
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  logger.i(origin);
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    logger.i(`Connection from origin ${request.origin} rejected`);
    return;
  }

  var connection = request.accept();
  logger.i('Connection accepted.');

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      logger.i(`Received Message: ${inspect(message)}`);
      connection.sendUTF(handler(message, mqttClient));
    } else if (message.type === 'binary') {
      logger.w(`Unhandled binary message : length: ${message.binaryData.length}`);
    }
  });

  connection.on('close', function (reasonCode, description) {
    logger.i(`Peer ${connection.remoteAddress} disconnected.`);
  });
});

process.on("beforeExit", () => {
  logger.i('closing ports...');
  mqttClient.end();
  wsServer.end();
})