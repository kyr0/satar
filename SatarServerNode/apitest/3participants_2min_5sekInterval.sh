#!/bin/sh

source testlib.sh

node ../apitest.js 1 10

usleep 5.44

node ../apitest.js 2 10

usleep 5.22

node ../apitest.js 3 10

usleep 80.342

node ../apitest.js 2 20

usleep 10.782

node ../apitest.js 1 20

usleep 10.312

node ../apitest.js 3 20