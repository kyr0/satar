#!/bin/sh

source testlib.sh

node ../apitest.js 1 10

usleep 15.44

node ../apitest.js 2 10

usleep 15.22

node ../apitest.js 3 10

usleep 15.22

node ../apitest.js 4 10

usleep 780 # 13min

node ../apitest.js 3 20

usleep 30.782

node ../apitest.js 1 20

usleep 20.312

node ../apitest.js 2 20

usleep 20.312

node ../apitest.js 4 20