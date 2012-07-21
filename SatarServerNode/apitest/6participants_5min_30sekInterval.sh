#!/bin/sh

source testlib.sh

node ../apitest.js 1 10

usleep 30.44

node ../apitest.js 2 10

usleep 30.22

node ../apitest.js 3 10

usleep 30.22

node ../apitest.js 4 10

usleep 30.22

node ../apitest.js 5 10

usleep 30.22

node ../apitest.js 6 10

usleep 20

node ../apitest.js 3 20

usleep 10.782

node ../apitest.js 1 20

usleep 20.312

node ../apitest.js 2 20

usleep 20.312

node ../apitest.js 4 20

usleep 20.312

node ../apitest.js 6 20

usleep 20.312

node ../apitest.js 5 20