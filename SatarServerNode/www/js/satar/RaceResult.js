Ext.ns('SATAR');

/**
 * @class SATAR.RaceResult
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * RaceResult modal window
 */
SATAR.RaceResult = {


    /**
     * @var {Object} Race report
     */
    raceReport: null,


    /**
     * Show race result
     * @param {Object} raceReport Race report
     * @return void
     */
    show: function(raceReport) {

        // Assign locally
        this.raceReport = raceReport;

        // Generate the HTML report
        this.generateHtmlReport(raceReport);

        // Show the report
        $('#modalResult').modal();
    },


    /**
     * Generates a nice bootstrap table structure
     * showing the race report.
     *
     * @param {Object} raceReport Race report
     * @return void
     */
    generateHtmlReport: function(raceReport) {

        // Calc report
        var report = this.calculateReport(raceReport);

        var summaryReport = '<h3>' + _('General') + '</h3>'
            + '<table class="table">'
            +     '<tr>'
            +     '<td><b>' + _('Name') + ':</b></td><td>' + report.raceName + '</td>'
            +     '</tr>'
            +     '<tr>'
            +     '<td><b>' + _('Participant count') + ':</b></td><td>' + report.participantCount + '</td>'
            +     '</tr>'
            +     '<tr>'
            +     '<td><b>' + _('Start time') + ':</b></td><td><i class="icon-time"></i> '
            +         report.raceStartTime + '</td>'
            +     '</tr>'
            +     '<tr>'
            +     '<td><b>' + _('Finish time') + ':</b></td><td><i class="icon-time"></i> '
            +         report.raceFinishTime + '</td>'
            +     '</tr>'
            +     '<tr>'
            +     '<td><b>' + _('Time elapsed') + ':</b><br />' + _('Start-to-end-Click')
            +         '</td><td><i class="icon-time"></i> '
            +         report.raceElapsedTime + 's</td>'
            +     '</tr>'
            + '</table><br />';

        // Generate rows of winners
        var winnerRows = '',
            currentParticipantNode = null;

        for (var i=0; i<report.bestByParticipantElapsed.length; i++) {

            currentParticipantNode = report.bestByParticipantElapsed[i];

            winnerRows += '<tr>'
              + '<td><b>' + (i+1) + '.</b></td>'
              + '<td>' + SATAR.getNameForParticipant(currentParticipantNode.participant_id)
              + ' [' + currentParticipantNode.participant_id + ']</td>'
              + '<td><i class="icon-time"></i> ' + currentParticipantNode.timeelapsed_startfinish + 'ms</td>'
              + '</tr>';
        }

        var winnerHead = '<thead><tr><td><b>' + _('#') + '</b></td><td><b>' + _('Participant')
                        + '</b></td><td><b>' + _('Race time') + '</b></td></tr></thead>';
        var winnerReport = '<h3>' + _('Best participants') + '</h3>'
              + '<table class="table">'
              +     winnerHead
              +     winnerRows
              + '</table>'

        // Update modal window content with reporting markup
        Ext.get('raceReport').update(summaryReport + winnerReport);
    },


    /**
     * Calculates the race report
     *
     * @param {Object} raceReport Race report
     * @return {Object}
     */
    calculateReport: function(raceReport) {

        // Calc participants and count
        var participants = [],
            raceParticipantCount = 0,
            raceElapsedTime = 0,
            formatRaceTime = function(d) {
                return d.getHours() + 'h ' + d.getMinutes() + 'm ' + d.getSeconds() + 's';
            };

        for (var i=0; i<raceReport.nodes.length; i++) {
            if (participants.indexOf(raceReport.nodes[i].participant_id) == -1) {
                participants.push(raceReport.nodes[i].participant_id);
            }
        }
        raceParticipantCount = participants.length;

        // Calc summary time
        raceElapsedTime = (raceReport.race.finishtime - raceReport.race.starttime) / 1000;

        // Calc dates
        raceStartDate = new Date(raceReport.race.starttime);
        raceFinishDate = new Date(raceReport.race.finishtime);

        // Calc/Sort winner by elapsed time per participant
        bestByParticipantElapsed = this.calculateBestByParticipantElapsed(raceReport.nodes);

        return {
            raceName: raceReport.race.name,
            participants: participants,
            participantCount: raceParticipantCount,
            raceElapsedTime: raceElapsedTime,
            raceStartTime: formatRaceTime(raceStartDate),
            raceFinishTime: formatRaceTime(raceFinishDate),
            bestByParticipantElapsed: bestByParticipantElapsed
        };
    },


    /**
     * Calculates the best participants per race by sorting
     * by the lowest participant based elapsed time.
     *
     * @param {Array} nodes Overall race event nodes
     * @return {Array}
     */
    calculateBestByParticipantElapsed: function(nodes) {

        var finishes = [];

        // Collect finishing nodes having a timeelapsed_startfinish
        for (var i=0; i<nodes.length; i++) {
            if (nodes[i].type === SATAR.eventTypes.FINISH &&
                nodes[i].timeelapsed_startfinish) {
                finishes.push(nodes[i]);
            }
        }

        // Sort smallest time up
        finishes.sort(function(a, b) {
            return a.timeelapsed_startfinish - b.timeelapsed_startfinish;
        });
        return finishes;
    }
};