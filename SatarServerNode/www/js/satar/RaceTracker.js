Ext.ns('SATAR');

/**
 * @class SATAR.RaceTracker
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * RaceTracker UI management.
 */
SATAR.RaceTracker = {


    /**
     * @var {Ext.Element} Start button reference
     */
    startRaceButton: null,


    /**
     * @var {Ext.Element} Stop button reference
     */
    stopRaceButton: null,


    /**
     * @var {Ext.Element} Started box reference
     */
    startedBox: null,


    /**
     * @var {Ext.Element} Finished box reference
     */
    finishedBox: null,


    /**
     * @cfg {Boolean} Is a race currently started?
     */
    isRaceStarted: false,


    /**
     * @var {String} Current race name
     */
    currentRaceName: '',


    /**
     * Simple event management handler
     * @return void
     */
    handleUI: function() {

        this.startRaceButton = Ext.select('#startRace');
        this.stopRaceButton = Ext.select('#stopRace');

        this.startedBox = Ext.query('#startedBox')[0];
        this.finishedBox = Ext.query('#finishedBox')[0];

        // Button click listener
        this.startRaceButton.on('click',
            this.onStartRaceClick,
            this
        );

        this.stopRaceButton.on('click',
            this.onStopRaceClick,
            this
        );
    },


    /**
     * Handle start button click
     * @param {Boolean} preventAction Prevent action (optional)
     * @return void
     */
    onStartRaceClick: function(preventAction) {

        if (!this.startRaceButton.disabled) {

            this.startRaceButton.disabled = true;
            this.stopRaceButton.disabled = false;

            if (preventAction !== true) {
                this.doStartRace();
            }

            this.isRaceStarted = true;

            // Attention to the stop button
            this.startRaceButton.addClass('disabled');
            this.stopRaceButton.removeClass('disabled');
        }
    },


    /**
     * Handle stop button click
     * @param {Boolean} preventAction Prevent action (optional)
     * @return void
     */
    onStopRaceClick: function(preventAction) {

        if (!this.stopRaceButton.disabled && this.isRaceStarted) {

            this.stopRaceButton.disabled = true;
            this.startRaceButton.disabled = false;

            if (preventAction !== true) {
                this.doStopRace();
            }

            this.isRaceStarted = false;

            // Attention to the stop button
            this.stopRaceButton.addClass('disabled');
            this.startRaceButton.removeClass('disabled');
        }
    },


    /**
     * Adds a node visually to the UI
     * @param {Object} nodeEvent Node event object
     * @return void
     */
    addNode: function(nodeEvent) {

        // Only add node if race has been started
        if (this.isRaceStarted) {

            var targetEl, targetEl,
                nodeElId = 'node-' + nodeEvent.id;

            // Add to start box
            if (nodeEvent.type === SATAR.eventTypes.START) {

                targetEl = this.startedBox;
                mode = 'started';

            } else if (nodeEvent.type === SATAR.eventTypes.FINISH) {

                targetEl = this.finishedBox;
                mode = 'finished';

            } else {

                //console.debug('Event type cannot be recognized: ', nodeEvent);
                return;
            }

            // Append node to DOM
            Ext.DomHelper.append(targetEl,
                this.buildNodeElement(nodeEvent, nodeElId, mode)
            );

            // Append popover to node in DOM
            SATAR.RaceTracker.buildPopover(nodeEvent, nodeElId, mode);

            // Fade in...
            Ext.get(nodeElId).fadeIn();
        }
    },


    /**
     * Generates an DOM element description for a node
     * @param {Object} nodeEvent Node element
     * @param {String} elId Element id
     * @param {String} mode Mode name
     * @return {Object}
     */
    buildNodeElement: function(nodeEvent, elId, mode) {

        var btnCls = '',
            timeElapsed = '',
            iconCls = '';

        if (mode == 'finished') {
            btnCls = 'btn-success';
            iconCls = 'icon-white';

            if (nodeEvent.timeelapsed_startfinish) {
                timeElapsed = '&ndash; <i class="icon-time icon-white"></i> '
                            + nodeEvent.timeelapsed_startfinish + ' ms';
            }
        }

        var nodeEl = {
            tag: 'button',
            id: elId,
            cls: 'satarnode btn ' + btnCls + ' btn-large disabled icon-user',
            style: 'display:none',
            html: '<i class="icon-user ' + iconCls + '"></i> '
                + '<b>' + SATAR.getNameForParticipant(nodeEvent.participant_id) + '</b>'
                + ' [' + nodeEvent.participant_id + '] '
                + timeElapsed
        };

        return nodeEl;
    },


    /**
     * Registers a popover for the participant's button
     * @param {Object} nodeEvent Node element
     * @param {String} elId Element id
     * @param {String} mode Mode name
     * @return void
     */
    buildPopover: function(nodeEvent, elId, mode) {

        var additionalRow = '';
        if (mode == 'finished') {

            var timeElapsed = _('No start node found.');
            if (nodeEvent.timeelapsed_startfinish) {
                timeElapsed = nodeEvent.timeelapsed_startfinish;
            }
            additionalRow = '<tr><td>' + _('Race time elapsed') + ': </td><td><i class="icon-time"></i> <b>'
                          + timeElapsed + 'ms</b></td></tr>';
        }

        var options = {
            title: 'Details',
            content:
                  '<table class="table">'
                + '<tr><td>' + _('Participant count') + ':</td><td><b>' + nodeEvent.participant_id + '</b></td></tr>'
                + '<tr><td>' + _('Node id') + ':</td><td><b>' + nodeEvent.node_id + '</b></td></tr>'
                + '<tr><td>' + _('Time') +': </td><td><i class="icon-time"></i> <b>'
                +     SATAR.RaceTracker.formatTimestamp(nodeEvent.timestamp)
                + '</b></td></tr>'
                + additionalRow
                + '</table>'
        };

        // Assign popover
        $('#' + elId).popover(options);
    },


    /**
     * Formats a timestamp and returns a nice time
     * @param {Number} timestamp Timestamp
     * @return {String}
     */
    formatTimestamp: function(timestamp) {

        var date = new Date(timestamp),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds(),
            millis = date.getMilliseconds();

        return hours + 'h ' + minutes + 'm ' + seconds + 's ' + millis + 'ms';
    },


    /**
     * Starts a race
     * @return void
     */
    doStartRace: function() {

        var me = this;

        // Cleanup boxes
        Ext.get(this.startedBox).update('');
        Ext.get(this.finishedBox).update('');

        // Prompt the user to enter race name
        bootbox.prompt(_('Please enter the name of the race:'), function(raceName) {

            if (!raceName || raceName == '') {

                me.onStopRaceClick(true);

            } else {

                // Set race name
                me.updateRaceName(raceName);

                // Emit startrace event
                SATAR.socket.emit('racestarted', {
                    name: raceName
                });

                // Fades in the current race data section
                Ext.get('currentRaceData').fadeIn();
            }
       });
    },


    /**
     * Updates the race name even visually
     * @param {String} raceName Race name
     * @return void
     */
    updateRaceName: function(raceName) {

        this.currentRaceName = raceName;

        // Set race name
        Ext.get('raceTitle').update(_('Race: ') + raceName);
    },


    /**
     * Applies a current race state
     * @param {Object} currentRaceReport Current race state report
     * @return void
     */
    applyCurrentRaceState: function(currentRaceReport) {

        // Set race name
        this.updateRaceName(currentRaceReport.race.name);

        // Set buttons in state
        this.onStartRaceClick(true);

        // Add corresponding nodes
        for (var i=0; i<currentRaceReport.nodes.length; i++) {

            // Add node to UI
            this.addNode(currentRaceReport.nodes[i]);
        }

        // Fades in the current race data section
        Ext.get('currentRaceData').fadeIn();
    },


    /**
     * Starts a race
     * @return void
     */
    doStopRace: function() {

        // Emit startrace event
        SATAR.socket.emit('racefinished');
    },


    /**
     * Initialize the UI
     * @return void
     */
    init: function() {

        // Handle UI events
        this.handleUI();
    }
};