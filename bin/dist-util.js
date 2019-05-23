#!/usr/bin/env node
const main = require('../lib/dist-util');
const yargs = require('yargs');
const argv = yargs
    .option('dist-folder', {
        type: 'string',
        alias: 'd',
        default: 'dist',
        describe: 'The name of the "dist" folder.'
    })
    .argv;
main.run(argv);
