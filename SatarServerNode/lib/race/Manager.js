var hook,
    currentRace,
    isRacing = false,
    currentRaceNodes = [];

/**
 * @class SATAR.race.Manager
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Manages races.
 */
var RaceManager = {


    /**
     * Initialize the global race management
     *
     * @return void
     */
    init: function() {
        console.log('  [OK] ...started.');
    },


    /**
     * Returns the current race
     * @return {Object}
     */
    getCurrentRace: function() {
        return currentRace;
    },


    /**
     * Sets the current race object
     * @param {Object} race Race object
     * @return void
     */
    setCurrentRace: function(race) {
        currentRace = race;
    },


    /**
     * Sets the node hook
     *
     * @param {Object} nodeHook hook.io reference
     * @return void
     */
    setHook: function(nodeHook) {
        hook = nodeHook;
    },


    /**
     * Sets the current race finished
     * @return void
     */
    setRaceFinished: function() {

        // Reset all global variables
        isRacing = false;
        currentRace = undefined;
        currentRaceNodes = [];
    },


    /**
     * Sets the current race started
     * @param {Object} race Race reference
     * @return void
     */
    setRaceStarted: function(race) {
        currentRace = race;
        isRacing = true;
    },


    /**
     * Returns if the race has been started
     * @return {Boolean}
     */
    isRacing: function() {
        return isRacing;
    },


    /**
     * Returns a race report containing all
     * recorded node records and the race record itself.
     *
     * @return {Object}
     */
    getCurrentRaceReport: function() {

        return {
            race: currentRace,
            nodes: currentRaceNodes
        };
    },


    /**
     * Adds an event node to the current race
     * @param {SATAR.event.Node} nodeEvent Node event instance
     * @return void
     */
    addNodeToCurrentRace: function(nodeEvent) {
        currentRaceNodes.push(nodeEvent);
    }
};

module.exports.init = RaceManager.init;
module.exports.getCurrentRace = RaceManager.getCurrentRace;
module.exports.setCurrentRace = RaceManager.setCurrentRace;
module.exports.setHook = RaceManager.setHook;
module.exports.isRacing = RaceManager.isRacing;
module.exports.setRaceStarted = RaceManager.setRaceStarted;
module.exports.setRaceFinished = RaceManager.setRaceFinished;
module.exports.getCurrentRaceReport = RaceManager.getCurrentRaceReport;
module.exports.addNodeToCurrentRace = RaceManager.addNodeToCurrentRace;

