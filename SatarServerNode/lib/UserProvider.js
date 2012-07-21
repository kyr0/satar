var mysql = require('mysql'),
    conn, config;

/**
 * @class SATAR.UserProvider
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * User provider which collects user mapping informations from
 * an external database.
 */
var UserProvider = {

    /**
     * Connects to the mysql database
     * @return void
     */
    init: function() {

        config = require('../config.js');

        if (config.userDatabase) {

            // Configure connect to SATAR mysql database
            conn = mysql.createConnection({
                host: config.userDatabase.host,
                port: config.userDatabase.port || 3306,
                user: config.userDatabase.username,
                password: config.userDatabase.password
            });

            // Connect to database
            conn.connect();

            // Use SATAR database
            conn.query('USE ' + config.userDatabase.schema);

        } else {
            console.error('Database configuration for userDatabase is missing. Check config.js.');
        }
    }(),


    /**
     * Returns the user mapping read from external mysql database
     * @param {Function} cb Callback function for result data
     * @return {Object}
     */
    getUserMapping: function(cb) {

        var selectQuery = 'SELECT * FROM ' + config.userDatabase.tableName;

        // Select user data
        conn.query(selectQuery, function(err, res) {
            cb(res);
        });
    }
};

module.exports.getUserMapping = UserProvider.getUserMapping;