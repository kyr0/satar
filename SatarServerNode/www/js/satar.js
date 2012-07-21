Ext.ns('SATAR');

/**
 * @class SATAR
 * @singleton
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Satar web main class.
 */
Ext.apply(SATAR, {

    /**
     * @var {Object} Event type mapping
     */
    eventTypes: {
        START: 10,
        FINISH: 20
    },


    /**
     * @private
     * @var {Object} Socket.io reference
     */
    socket: null,


    /**
     * @var {Object} User data mapping (set by server event)
     */
    userMapping: {},


    /**
     * Initializes the socket.io communication
     *
     * @return void
     */
    initSocketIO: function() {

        this.socket = io.connect();

        // Handle user data
        this.socket.on('usermapping', function(userMapping) {
            SATAR.userMapping = userMapping;
        });

        // Handle current race report (statefulness, reply of current state)
        this.socket.on('currentracereport', function(currentRaceReport) {

            // If there were an currently _active_ race started in the past...
            if (currentRaceReport && currentRaceReport.race && currentRaceReport.race.name) {

                // Apply this current race state visually
                SATAR.RaceTracker.applyCurrentRaceState(currentRaceReport);
            }
        });

        // Handle incoming node emits
        this.socket.on('node', function(nodeEvent) {

            // Handle new nodes added
            SATAR.RaceTracker.addNode(nodeEvent);

        }.bind(SATAR.RaceTracker));

        // Bind race management events received from
        // backend when another web client fired these
        this.socket.on('racestarted', function(race) {

            // Set current race name
            this.currentRaceName = race.name;

            // Show the UI in race started state
            // without doing anything else
            this.onStartRaceClick(true);

        }.bind(SATAR.RaceTracker));

        // Bind to remote racefinished event to show the
        // race result window (statistics) even if another
        // web client stopped the race measurement
        this.socket.on('racefinished', function(raceStatistics) {

            // Show the UI in race finished state
            // without doing anything else
            this.onStopRaceClick(true);

            // Is given on remote event
            if (raceStatistics) {

                // Show modal race statistics window
                SATAR.RaceResult.show(raceStatistics);
            }

        }.bind(SATAR.RaceTracker));
    },


    /**
     * Translates a language key
     * @param {String} text Language key text
     * @return {String}
     */
    _: function(text) {

        if (SATAR_i18n && SATAR_i18n[text]) {
            return SATAR_i18n[text];
        }
        return text;
    },


    /**
     * Returns the participant concatinated name for id
     *
     * @param {Number} participantId Participant id
     * @return {String}
     */
    getNameForParticipant: function(participantId) {

        var currentParticipant = null;
        for (var participant in SATAR.userMapping) {

            currentParticipant = SATAR.userMapping[participant];

            if (parseInt(currentParticipant.participant_id) === participantId) {
                return currentParticipant.firstname + ' ' + currentParticipant.lastname;
            }
        }
        return _('Unknown participant');
    },


    /**
     * Launch the web app
     * @return void
     */
    launch: function() {

        Ext.onReady(function() {

            // Init socket.io
            SATAR.initSocketIO();

            // Handle UI interactions
            SATAR.RaceTracker.init();
        });
    }()
});

// Shortcut for translation function
window._ = SATAR._;