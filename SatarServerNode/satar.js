/**
 * @class SATAR
 * @extends Object
 * @singleton
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Satar node.js main class.
 */
var SATAR = {


    /**
     * @var {String} Server version
     */
    version: '0.4',


    /**
     * @var {Array} Required lib files, autoloaded
     */
    requires: [{
        name: 'node_EventObserver',
        file: './lib/node/EventObserver.js'
    }, {
        name: 'web_NodeService',
        file: './lib/web/NodeService.js'
    }, {
        name: 'web_Server',
        file: './lib/web/Server.js'
    }, {
        name: 'race_Manager',
        file: './lib/race/Manager.js'
    }],


    /**
     * @var {hook} Node hook
     */
    nodeHook: null,


    /**
     * @var {SATAR.race.Manager} Race manager instance
     */
    raceManager: null,


    /**
     * Prints logo
     * @return void
     */
    printLogo: function() {

        console.log('');
        console.log('      ____      ____    _____    ____      ____ CC ');
        console.log('  ___(_ (_`____/ () \\__|_   _|__/ () \\____| () )_____   ');
        console.log('    .__)__)   /__/\\__\\   |_|   /__/\\__\\   |_|\\_\\');
        console.log('  System for Advanced Timekeeping and Amateur Racing.');
        console.log('');
    },


    /**
     * Prints version info
     * @return void
     */
    printVersion: function() {

        console.log('  version: ' + this.version);
    },


    /**
     * Autoloads all required libs
     * @return void
     */
    requireLibs: function() {

        for (var i=0; i<this.requires.length; i++) {
            this[this.requires[i].name] = require(this.requires[i].file);
        }
    },


    /**
     * Launch the server instances and broadcast hooks
     * @return void
     */
    launch: function() {

        try {

            console.log();

            SATAR.requireLibs();

            this.printStartupMessage();

            console.log();

            this.initRaceManager();
            this.initIOHook();
            this.initNodeEventObserver();
            this.initWebServer();

            console.log();
            console.log('  [OK] SATAR startup successful!');
            console.log();

            console.log('----- Log Output -----');

        } catch (e) {

            console.log();
            console.error('  [ERR] SATAR startup failed!', e);
        }
    },


    /**
     * Prints the startup message when server gets executed
     * @return void
     */
    printStartupMessage: function() {

        this.printLogo();
        this.printVersion();

        console.log();

        console.log('SATAR server starting...');
    },


    /**
     * Creates a race manager instance
     * @return void
     */
    initRaceManager: function() {

        console.log('  * Starting race manager...');

        // Initialize the NodeService web service
        SATAR.race_Manager.init();
    },


    /**
     * Creates the async inter-process broadcast hook used to interact with incoming
     * @return void
     */
    initIOHook: function() {

        console.log('  * Registering system-wide async eventing using hook.io...');

        // Initialize the EventObserver for node events
        this.nodeHook = SATAR.node_EventObserver.init(SATAR.race_Manager);

        // Set the hook reference
        SATAR.race_Manager.setHook(this.nodeHook);
    },


    /**
     * Creates the express based web service to handle incoming node events.
     * @return void
     */
    initNodeEventObserver: function() {

        console.log('  * Starting node event web service...');

        // Initialize the NodeService web service
        SATAR.web_NodeService.init(this.nodeHook, SATAR.race_Manager);
    },


    /**
     * Create the express based web server for UI serving
     * @private
     * @return void
     */
    initWebServer: function() {

        console.log('  * Starting UI web server...');

        // Initialize the NodeService web service
        SATAR.web_Server.init(this.nodeHook, SATAR.race_Manager);
    }
};

// Start the server
SATAR.launch();