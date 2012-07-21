var express = require('express'),
    raceManager, hook;

/**
 * @class SATAR.web.NodeService
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Webservice to handle incoming node events.
 */
var NodeService = {


    /**
     * @var {Object} Express reference
     */
    service: null,


    /**
     * Initialize the global async hook
     *
     * @param {Object} nodeHook hook.io reference
     * @param {SATAR.race.Manager} raceManagerRef Race manager reference
     * @return void
     */
    init: function(nodeHook, raceManagerRef) {

        // Configure hooking
        hook = nodeHook;
        raceManager = raceManagerRef;

        // Configure webserver
        this.service = express.createServer();

        var config = require('../../config.js');

        if (config.nodeService && config.nodeService.port) {

            // Listen to configured service port
            this.service.listen(config.nodeService.port);

            console.log('  [OK] ...started.');

        } else {

            console.error('No node service configuration given (port). Check config.js!');
        }

        // Start webservice
        this.startListening();
    },


    /**
     * Listens to service API requests
     * @return void
     */
    startListening: function() {

        var me = this;

        // Listen for API requests
        this.service.get('/ts/:timestamp/rts/:reset_timestamp_ms/t/:type/p/:participant_id/n/:node_id',
        function(req, res, next) {

            var nodeEvent = require('../event/Node.js');

            // Create a nodeEvent instance
            var nodeEvent = nodeEvent.getInstance({
                timestamp: parseInt(req.params.timestamp),
                reset_timestamp_ms: parseInt(req.params.reset_timestamp_ms),
                type: parseInt(req.params.type),
                participant_id: parseInt(req.params.participant_id),
                node_id: parseInt(req.params.node_id)
            });

            // Emit nodeEvent
            hook.emit('node', nodeEvent);

            // Respond 200 OK anytime
            res.send(true);
        });
    }
};

// Export the initialization method
module.exports.init = NodeService.init;
module.exports.startListening = NodeService.startListening;