var mysql = require('mysql'),
    Node = require('../event/Node.js'),
    hook,
    conn,
    raceManager;

/**
 * @class SATAR.node.NodePersistor
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Persistor to persist events in a mysql database.
 */
var EventPersistor = {


    /**
     * Connects to the mysql database
     * @param {Object} nodeHook hook.io reference
     * @param {Object} raceManagerRef Race manager reference
     * @return void
     */
    init: function(nodeHook, raceManagerRef) {

        hook = nodeHook;
        raceManager = raceManagerRef;

        // Register for race management events
        this.initRaceManagement();

        // Connect to database
        this.initDatabase();
    },


    /**
     * Connects to the mysql database
     * @return void
     */
    initDatabase: function() {

        var config = require('../../config.js');

        if (config.database) {

            // Configure connect to SATAR mysql database
            conn = mysql.createConnection({
                host: config.database.host,
                port: config.database.port || 3306,
                user: config.database.username,
                password: config.database.password
            });

            // Connect to database
            conn.connect();

            // Use SATAR database
            conn.query('USE ' + config.database.schema);

        } else {
            console.error('Database configuration missing. Check config.js.');
        }
    },


    /**
     * Registers hooks for race status management
     * @return void
     */
    initRaceManagement: function() {

        var me = this;

        hook.on('racestarted', function(race) {
            me.persistNewRace(race);
        });

        hook.on('racefinished', function() {

            // Update race and set finished state
            me.updateRaceFinished();
        });
    },


    /**
     * Updates a race to finished state and
     * sets a current timestamp
     *
     * @param {Number} raceId Race id
     * @return void
     */
    updateRaceFinished: function(raceId) {

        var finishtime = new Date().getTime();

        // Use current race id if not given
        if (!raceId) {
            raceId = raceManager.getCurrentRace().id;
        }

        conn.query('UPDATE race SET finishtime = ' + finishtime + ' WHERE id = ' + raceId,
        function(err) {

            if (err) throw err;

            // Set finishtime on race reference
            var currentRace = raceManager.getCurrentRace();
            currentRace.finishtime = finishtime;

            // Update race object
            raceManager.setCurrentRace(currentRace);

            // Emit the report generated for current race
            hook.emit('racereportfinished', raceManager.getCurrentRaceReport());

            // Set race finished
            raceManager.setRaceFinished();
        });
    },


    /**
     * Persists a new race in database
     * @param {Object} race Race object
     * @return void
     */
    persistNewRace: function(race) {

        var starttime = new Date().getTime();

        console.log('Create a race record and set currentRaceId!');

        // Insert query
        conn.query('INSERT INTO race(name, starttime) VALUES("' + race.name +'", ' + starttime + ')',
        function(err, result) {

            if (err) throw err;

            // Set primary key as current race id
            race.id = result.insertId;

            // Set starttime
            race.starttime = starttime;

            // Set race started
            raceManager.setRaceStarted(race);
        });
    },


    /**
     * Persists a node for a race
     * @param {Number} nodeEventId Node event id
     * @param {Number} raceId Race id
     * @return void
     */
    persistForRace: function(nodeEventId, raceId) {

        // Insert query
        conn.query('INSERT INTO node_event_to_race SET ?', {
            race_id: raceId,
            node_event_id: nodeEventId
        });
    },


    /**
     * Persists a node event
     * @param {SATAR.event.Node} nodeEvent Node event instance
     * @return void
     */
    persistNode: function(nodeEvent) {

        // Insert query
        conn.query('INSERT INTO node_event SET ?', {
            timestamp: nodeEvent.timestamp,
            reset_timestamp_ms: nodeEvent.reset_timestamp_ms,
            type: nodeEvent.type,
            participant_id: nodeEvent.participant_id,
            node_id: nodeEvent.node_id
        },
        function(err, result) {

            if (err) throw err;

            // Set primary key on event reference
            nodeEvent.id = result.insertId;

            // Persist an event -> race relation record if
            // race has been started
            if (raceManager.isRacing()) {

                // Assign a node to a race record
                EventPersistor.persistForRace(nodeEvent.id, raceManager.getCurrentRace().id);

                // Handle different node types
                EventPersistor.dispatchNodeEventByType(nodeEvent);

            } else {

                // Emit nodeEvent
                hook.emit('nodepersisted', nodeEvent);
            }

        });
    },


    /**
     * Handles dispatching of different node types
     * @param {SATAR.event.Node} nodeEvent Node event instance
     * @return void
     */
    dispatchNodeEventByType: function(nodeEvent) {

        var typeMap = Node.getTypeMap();

        console.log('dispatchNodeEventByType', nodeEvent, typeMap);

        // Start node
        if (nodeEvent.type === typeMap.START) {

            console.log('Participant started: ', nodeEvent.participant_id);

            // Emit nodeEvent
            hook.emit('nodepersisted', nodeEvent);

            // Add the node to current race
            raceManager.addNodeToCurrentRace(nodeEvent);

        } else if (nodeEvent.type === typeMap.FINISH) {

            console.log('Participant finished: ', nodeEvent.participant_id);

            // Calculates the timestamp difference from START to FINISH
            EventPersistor.updateNodeTimeGapForCurrentRace(nodeEvent, function(nodeEvent) {

                // Emit nodeEvent after calc & update to inform even
                // the web clients about the results
                hook.emit('nodepersisted', nodeEvent);

                // Add the node to current race
                raceManager.addNodeToCurrentRace(nodeEvent);
            });
        }
    },


    /**
     * Caluclates the timestamp difference between the START
     * and the FINISH node to gather the time elapsed in between.
     * This time gets stored in the node record in ms.
     *
     * @param {SATAR.event.Node} nodeEvent Node event instance
     * @param {Function} cb Callback to call after update execution
     * @return void
     */
    updateNodeTimeGapForCurrentRace: function(nodeEvent, cb) {

        var typeMap = Node.getTypeMap(),
            raceId = raceManager.getCurrentRace().id;

        var selectQuery = 'SELECT DISTINCT ne.timestamp AS ts FROM node_event ne, node_event_to_race netr '
                        + 'WHERE netr.race_id=' + raceId + ' AND ne.id = netr.node_event_id AND ne.type = '
                        + typeMap.START + ' AND ne.participant_id = ' + nodeEvent.participant_id;

        // Select START node from database
        conn.query(selectQuery, function(err, res) {

            if (err) throw err;

            // START node was found
            if (res.length > 0) {

                // Finish timestamp - Start timestamp = Time elapsed in ms
                nodeEvent.timeelapsed_startfinish = parseInt(nodeEvent.timestamp - res[0].ts);

                // Update node...
                conn.query('UPDATE node_event SET timeelapsed_startfinish = ' + nodeEvent.timeelapsed_startfinish
                          +' WHERE id = ' + nodeEvent.id,
                function(err) {

                    if (err) throw err;

                    // Call callback
                    cb(nodeEvent);
                });

            } else {

                console.log('Error: No START node was found for FINISH node!');

                // Call callback
                cb(nodeEvent);
            }
        });

    }
};

// Export the initialization method
module.exports.init = EventPersistor.init;
module.exports.persistNode = EventPersistor.persistNode;
module.exports.persistNewRace = EventPersistor.persistNewRace;
module.exports.initRaceManagement = EventPersistor.initRaceManagement;
module.exports.initDatabase = EventPersistor.initDatabase;
module.exports.updateRaceFinished = EventPersistor.updateRaceFinished;
module.exports.dispatchNodeEventByType = EventPersistor.dispatchNodeEventByType;
module.exports.updateNodeTimeGapForCurrentRace = EventPersistor.updateNodeTimeGapForCurrentRace;