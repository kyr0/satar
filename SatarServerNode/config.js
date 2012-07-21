// Webserver configuration (SATAR UI)
var webserver = {
    port: 8080
};

// Node webservice configuration (SATAR node service)
var nodeService = {
    port: 8081
};

// Database configuration (SATAR system)
var database = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: null,
    schema: 'SATAR'
};

// User database configuration
// (External data pool containing the user information)
var userDatabase = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: null,
    schema: 'SATARUSER',
    tableName: 'users'
};

// Export configs
module.exports.webserver = webserver;
module.exports.nodeService = nodeService;
module.exports.database = database;
module.exports.userDatabase = userDatabase;