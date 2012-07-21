Node Service API testing:

The NodeService API (webservice provided by satar.js) can be tested
by the apitest.js tool by simulating single node events.

This directory contains some batch processing tests to simulate
different kinds of races.

- 4participants_15min_15sekInterval.sh
- 8participants_5min_30sekInterval.sh
- 3participants_2min_5sekInterval.sh

Note:
These scripts just simulate the node events like it would happen
in a real race. You should start a race fist in the web frontend.