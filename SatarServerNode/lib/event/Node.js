/**
 * @class SATAR.event.Node
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Event object that represents a node event.
 */
var Node = function(cfg) {

    // Set-up an node event
    this.id = cfg.id;
    this.timestamp = cfg.timestamp;
    this.reset_timestamp_ms = cfg.reset_timestamp_ms;
    this.type = cfg.type;
    this.participant_id = cfg.participant_id;
    this.node_id = cfg.node_id;
    this.timeelapsed_startfinish = cfg.timeelapsed_startfinish;
};

// Default class members
Node.prototype = {
    id: undefined,
    timestamp: undefined,
    reset_timestamp_ms: undefined,
    type: undefined,
    participant_id: undefined,
    node_id: undefined,
    timeelapsed_startfinish: undefined
};

/**
 * Creates an instance of this node
 * @param {Object} cfg Event configuration
 * @return {SATAR.event.Node}
 */
Node.getInstance = function(cfg) {
    return new Node(cfg);
};

/**
 * Returns the node type map
 * @return {Object}
 */
Node.getTypeMap = function() {

    return {
        START: 10,
        FINISH: 20
    }
};

// Export the initialization method
module.exports.getInstance = Node.getInstance;
module.exports.getTypeMap = Node.getTypeMap;