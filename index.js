#!/usr/bin/env node

// this app works like nodemon. chokidar to check for changes. caporal to provide overall info (for developers).child_process to execute node file inside a node app, this is part of the fs library of node.

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
// chalk to add color to the console.log
const chalk = require('chalk');

const log = console.log;

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
        } catch (err) {
            throw new Error(`Could not find the file ${name}`);
        }

        // proc = process
        // this kills the old version of the file otherwise it wil add the old version.
        let proc;
        const start = debounce(() => {
            if (proc) {
                proc.kill();
            }
            log(chalk.red('>>>>>starting process'));
            proc = spawn('node', [name], { stdio: 'inherit' });
        }, 100);

        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);
