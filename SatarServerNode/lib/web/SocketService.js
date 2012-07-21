var socketio = require('socket.io'),
    io = null, hook, userMapping,
    raceManager;

// Require user mapping very early
require('../UserProvider.js').getUserMapping(function(res) {
    userMapping = res;
});

/**
 * @class SATAR.web.SocketService
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Web service socket.io
 */
var SocketService = {

    /**
     * @var {Object} socket.io service reference
     */
    service: null,


    /**
     * @var {Array} clientPool Client socket pool
     */
    clientPool: [],


    /**
     * Initialize the global async hook
     *
     * @param {Object} server Connect server reference
     * @param {Object} nodeHook hook.io reference
     * @param {SATAR.race.Manager} raceManagerRef Race manager reference
     * @return void
     */
    init: function(server, nodeHook, raceManagerRef) {

        // Configure hooking
        hook = nodeHook;
        raceManager = raceManagerRef;

        // Let socket.io service communicate through express webserver
        io = socketio.listen(server);

        console.log('  [OK] ...started.');

        // Bind nodepersisted event to emit event to each connected client
        hook.on('nodepersisted', this.onNodePersisted);

        // Wait for race report to be generated...
        hook.on('racereportfinished', function(report) {

            // Emit race report to all connected web clients
            io.sockets.emit('racefinished', report);
        });

        // Bind socket connection to new web clients
        io.sockets.on('connection', this.onConnection);
    },


    /**
     * Gets called for each web client that connects
     *
     * @param {Object} socket Client socket reference
     * @return void
     */
    onConnection: function(socket) {

        // Push socket to client pool
        SocketService.clientPool.push(socket);

        // Emit user data
        socket.emit('usermapping', userMapping);

        // Emit current race state report
        socket.emit('currentracereport', raceManager.getCurrentRaceReport());

        // Register handlers for UI control events
        socket.on('racestarted', function(race) {

            // Emit internal racestarted event
            hook.emit('racestarted', race);

            // Emit externally to all other connected clients
            io.sockets.emit('racestarted', race);
        });

        socket.on('racefinished', function() {

            // Emit internal racefinished event
            hook.emit('racefinished');
        });

        // Handle disconnects
        socket.on('disconnect', function () {

            console.log('Client disconnected...');

            // Pop client socket from pool
            SocketService.clientPool.pop(socket);
        });
    },


    /**
     * Gets called when a node event was inserted in database
     * @param {SATAR.event.Node} nodeEvent Node event reference
     * @return void
     */
    onNodePersisted: function(nodeEvent) {

        // Broadcast emit a node event to the web client
        io.sockets.emit('node', nodeEvent);
    }
};

// Export the initialization method
module.exports.init = SocketService.init;
module.exports.onConnection = SocketService.onConnection;
module.exports.onNodePersisted = SocketService.onNodePersisted;
module.exports.onRaceStarted = SocketService.onRaceStarted;
module.exports.onRaceFinished = SocketService.onRaceFinished;