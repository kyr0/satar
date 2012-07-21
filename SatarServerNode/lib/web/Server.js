var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    raceManager, hook;

/**
 * @class SATAR.web.Server
 * @singleton
 * @extends Object
 * @author Aron Homberg <info@aron-homberg.de>
 *
 * Webserver for UI serving
 */
var Server = {


    /**
     * @var {Object} Connect server reference
     */
    server: null,


    /**
     * @var {Object} Express reference
     */
    express: null,


    /**
     * Initialize the webserver
     *
     * @param {Object} nodeHook hook.io reference
     * @param {SATAR.race.Manager} raceManagerRef Race manager reference
     * @return void
     */
    init: function(nodeHook, raceManagerRef) {

        hook = nodeHook;
        raceManager = raceManagerRef;

        // Configure web server
        this.express = express();
        this.server = http.createServer(this.express);

        var config = require('../../config.js');

        if (config.webserver && config.webserver.port) {

            // Listen to configured service port
            this.server.listen(config.webserver.port);

            // Register engine
            this.express.engine('.html', require('ejs').__express);

        } else {

            console.error('No webserver configuration given (port). Check config.js!');
        }

        // Start webservice
        this.startListening();

        // Start socket.io service
        this.startSocketService();
    },


    /**
     * Listens to service API requests
     * @return void
     */
    startListening: function() {

        var me = this;

        // Listen for API requests
        this.express.get('/*', function(req, res, next) {

            var reqPath = req.params[0],
                webRootPath = __dirname + '/../../www/';

            // If no path given, use index file
            if (reqPath.length === 0) {
                reqPath = 'index.html';
            }

            // Dispatch static file
            me.dispatchFile(webRootPath + reqPath, req, res);
        });

        console.log('  [OK] ...started.');
    },


    /**
     * Pre-dispatches a file
     *
     * @param {String} targetFile Path of file to deliver
     * @param {Object} req Request object
     * @param {object} res Response object
     * @return void
     */
    dispatchFile: function(targetFile, req, res) {

        console.log("Dispatching... "  + targetFile);

        var me = this;

        // Dispatch file dispatching
        fs.stat(targetFile, function(err, stats) {

            if (err) {

                if (err.code === 'ENOENT') {
                    res.send(404);
                } else {
                    res.send(500);
                }

            } else {

                // Really deliver the file
                me.deliverFile(req, res, targetFile);
            }
        });
    },


    /**
     * Delivers a file requested via HTTP/GET
     *
     * @param {Object} req Request object
     * @param {object} res Response object
     * @param {String} filePath Path of file to deliver
     * @return void
     */
    deliverFile: function(req, res, filePath) {

        var contentType = mime.lookup(filePath),
            fileNameEnding = filePath.split('.'),
            fileNameEnding = fileNameEnding[fileNameEnding.length-1],
            data = fs.readFileSync(filePath, "binary"),
            httpStatus = 200;

        // EJS html/json files need to be processed by ejs
        if (fileNameEnding === "html") {

            // Set content type explicitly
            contentType = 'text/html';

            // Render the EJS/HTML template
            try {

                // Renders ../../www/index.html
                res.render(filePath, {
                    params: req.params
                });

            } catch(e) {

                // In case of any error, emit an internal server error
                httpStatus = 500;
                data = "Template error: " + e.message;
            }
        } else {

            // Synchronous deliver the content
            res.writeHead(httpStatus, {'Content-Type': contentType});
            res.write(data, "binary");
            res.end();
        }

        // Free memory
        delete contentType, data, fileNameEnding, httpStatus;
    },


    /**
     * Starts the socket.io based service
     * @return void
     */
    startSocketService: function() {

        console.log('  * Starting socket.io frontend broadcasting service...');

        // Initialize the socket.io service with the express instance
        var socketService = require('./SocketService');
        socketService.init(this.server, hook, raceManager);
    }
};

// Export the initialization method
module.exports.init = Server.init;
module.exports.startListening = Server.startListening;
module.exports.startSocketService = Server.startSocketService;
module.exports.deliverFile = Server.deliverFile;
module.exports.dispatchFile = Server.dispatchFile;