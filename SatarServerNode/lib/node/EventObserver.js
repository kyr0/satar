// Load and initialize the NodePersistor
var hookio = require('hook.io'),
    nodePersistor = require('./EventPersistor.js'),
    raceManager;

/**
 * @class SATAR.node.EventObserver
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Event observer (system-wide async IO) using hook.io.
 */
var EventObserver = {


    /**
     * @var {Object} Node observer hook
     */
    nodeEventHook: null,


    /**
     * @var {SATAR.node.EventPersistor} Node persistor instance
     */
    nodePersistor: null,


    /**
     * Initialize the global async hook
     *
     * @param {SATAR.race.Manager} raceManagerRef Race manager reference
     * @return void
     */
    init: function(raceManagerRef) {

        raceManager = raceManagerRef;

        // Register global node event hook
        this.nodeEventHook = hookio.createHook({
            name: 'NodeEventObserver'
        });

        // Register node event listener
        this.nodeEventHook.on('node', this.onNodeEvent);

        // Start hooking
        this.nodeEventHook.start();

        console.log('  [OK] ...registered.');

        // Init node persistor
        nodePersistor.init(this.nodeEventHook, raceManagerRef);

        // Return the hook reference
        return this.nodeEventHook;
    },


    /**
     * Node event listener that gets called when a new
     * node event comes in and gets emitted.
     *
     * @param {SATAR.event.Node} nodeEvent Node event instance
     * @return void
     */
    onNodeEvent: function(nodeEvent) {

        // Persist the nodeEvent
        nodePersistor.persistNode(nodeEvent, this.nodeEventHook);
    }
};

// Export the initialization method
module.exports.init = EventObserver.init;
module.exports.onNodeEvent = EventObserver.onNodeEvent;