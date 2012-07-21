/**
 * Simulates a hardware controller device which calls the
 * SATAR NodeService web service.
 *
 * USAGE:
 *
 * node apitest.js $participantId $type $nodeId[optional]
 */

console.log();

if (process.argv.length < 4) {
    console.log('USAGE: node apitest.js $participantId $type $nodeId[optional]');
    console.log();
    process.kill();
}

var participantId = process.argv[2],
    type = process.argv[3],
    nodeId = process.argv[4] || parseInt(Math.random() * 10),
    timestamp = new Date().getTime(),
    reset_ts = new Date().getTime();

console.log('Calling NodeService API for test using: ');
console.log();
console.log('* Participant ID: ', participantId);
console.log('* Type: ', type);
console.log('* Node ID: ', nodeId);
console.log('* Timestamp: ', timestamp);
console.log('* Reset Timestamp: ', reset_ts);
console.log();

var config = require('./config.js'),
    host = config.nodeService.host || '127.0.0.1';

console.log('WebService configuration: ', config.nodeService);

console.log();

var requestUri = '/ts/' + timestamp + '/rts/' + reset_ts
               + '/t/' + type + '/p/' + participantId
               + '/n/' + nodeId;

var webServiceUrl = 'http://' + host + ':' + config.nodeService.port
                  + requestUri;

console.log('Calling URL: ');
console.log('  * ', webServiceUrl);

console.log();
console.log('--- RESPONSE ---');
console.log();

// Call http client to fire webservice request
var http = require('http');

http.get(webServiceUrl, function(res) {


    console.log("  * NodeService response status: " + res.statusCode);
    console.log();

}).on('error', function(e) {

    console.log("  * NodeService error: " + e.message);
    console.log();
});