#!/bin/sh

node ../apitest.js 1 10
node ../apitest.js 2 10
node ../apitest.js 3 10
node ../apitest.js 4 10

node ../apitest.js 3 20
node ../apitest.js 1 20
node ../apitest.js 2 20
node ../apitest.js 4 20