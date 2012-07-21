#!/bin/sh

# @see https://github.com/senchalabs/jsduck

# To run this program, you need to install Ruby 1.9+ and JSDuck gem:
# $ [sudo] gem install jsduck

jsduck ../www/js --ignore-global --builtin-classes --output satar_www
jsduck ../lib ../satar.js --builtin-classes --output satar_server