#!/usr/bin/env node
const cli = require('commander');
const path = require('path');
const _ = require('lodash');
const pkg = require('./package.json');
const headers = require('./data/headers');
const students = require('./data/students');
const print = require('./util/print');
const tools = require('./util/tools');
let defaultCSV = path.resolve('./data/G-30-Full-Stack-GT-July-2016.csv');

cli
  .version(pkg.version)
  .usage('<num> [options]')
  .option('-f, --file [file]', 'Specify a class roster CSV.', tools.getPath)
  .option('-l, --list', 'Print full list of students from file.')
  .option('-c, --countdown <num>', 'Change the length of the countdown.')
  .option('-C, --chunk <num>', 'Chunk students into <num> sized groups.')
  .parse(process.argv);

let numStudents = cli.args[0] ? Number.parseInt(cli.args[0]): 1;
let countdown = cli.countdown ? Number.parseInt(cli.countdown) : 3;

if (cli.list) {
  print.roster(students);
  return;
}
else if (cli.file && cli.file !== true) {
  // parse the passed file
  let passedFile = path.resolve(cli.file);
  tools.load(passedFile)
  .then(students => {
    let selected = _.sampleSize(students, numStudents);
    print.countdown(countdown, headers)
    .then(() => { print.students(selected); });
  }).catch(error => console.log(error));
}
else if (cli.file) {
  // no passed file, try to use default CSV
  tools.load(defaultCSV)
  .then(students => {
    let selected = _.sampleSize(students, numStudents);
    print.countdown(countdown, headers)
    .then(() => { print.students(selected); });
  }).catch(error => console.log(error));
}
else if (cli.chunk && cli.chunk > 1) {
  let chunkSize = parseInt(cli.chunk);
  let shuffled = _.shuffle(tools.removeInstructors(students));
  let chunked = _.chunk(shuffled, chunkSize);
  print.chunks(chunked);
}
else {
  let selected = _.sampleSize(students, numStudents);
  print.countdown(countdown, headers)
  .then(() => { print.students(selected); })
  .catch(err => console.log(err));
}
