      ____      ____    _____    ____      ____ CC
  ___(_ (_`____/ () \__|_   _|__/ () \____| () )_____
    .__)__)   /__/\__\   |_|   /__/\__\   |_|\_\
  System for Advanced Timekeeping and Amateur Racing.

                     Server Node


Abstract:

The ServerNode sub-project implements the webserver,
webservice and socket service for real-time broadcasting
the racing events and manage all the racing measurement logic.

                        -++-

Running it:

To run this server you need to install node.js:
-> http://www.nodejs.org

Additionally call:

npm install hook.io
npm install socket.io
npm install express
npm install ejs
npm install mysql@2.0.0-alpha3
npm install mime

                        -++-

Configuring & Starting it:

Start server: node satar.js

Afterwards access UI via e.g.:

    http://localhost:8080

If the default settings (port, host configuration)
isn't what you need, just edit the self-explaining
config.js file.

                        -++-

Testing & Simulating read hardware controllers:

Your can simulate node events using e.g.:

    wget http://127.0.0.1:8081/ts/12301222/rts/312312/t/20/p/1/n/1

or curl or any other HTTP client.

For testing purposes we have implemented a node API test tool,
called apitest.js which is a specific HTTP client implementation
that builds and executes API requests out of CLI parameters:

   USAGE: node apitest.js $participantId $type $nodeId [optional]

   e.g. node apitest.js 1 20

                        -++-

Visit the web frontend:

Just use a modern browser and visit:

    http://localhost:8080

Note:
The host and port configuration may differ when config.js has been edited.