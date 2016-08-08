#!/usr/bin/env node
const cli = require('commander');
const colors = require('colors');
const csv = require('fast-csv');
const path = require('path');
const _ = require('lodash');
const ora = require('ora');

const headers = require('./data/headers');
const students = require('./data/students');
const print = require('./print.js');
let defaultCSV = path.resolve('./data/G-30-Full-Stack-GT-July-2016.csv');

cli
  .version('1.0.0')
  .usage('<num> [options]')
  .option('-f, --file [file]', 'Specify a class roster CSV.', getPath)
  .option('-l, --list', 'Print full list of students from file.')
  .parse(process.argv);

let numStudents = cli.args[0] ? Number.parseInt(cli.args[0]): 1;
let countdown = 3;

if (cli.list) {
  print.roster(students);
  return;
}
else if (cli.file && cli.file !== true) {
  // parse the passed file
  let passedFile = path.resolve(cli.file);
  loadStudents(passedFile)
  .then(students => {
    let selected = selectStudents(students, numStudents);

    print.countdown(countdown, headers)
    .then(() => { print.students(selected); });
  }).catch(error => console.log(error));
}
else if (cli.file) {
  // no passed file, try to use default CSV
  loadStudents(defaultCSV)
  .then(students => {
    let selected = selectStudents(students, numStudents);
    print.countdown(countdown, headers)
    .then(() => { print.students(selected); });
  }).catch(error => console.log(error));
}
else {
  var selected = selectStudents(students, numStudents);
  print.countdown(countdown, headers)
  .then(() => { print.students(selected); })
  .catch(err => console.log(err));
}

// Loads student file into an array
function loadStudents(file) {
  return new Promise((resolve, reject) => {
    let students = [];

    csv
    .fromPath(file)
    .on('data', data => {
      students.push(data[2] + ' ' + data[3]);
    }).on('end', () => {
      // first line of the CSV from Galvanize are column labels
      resolve(students.slice(1));
    });
  });
}

// Returns random selection of num student(s)
function selectStudents(students, num) {
  var randomized = _.shuffle(students);
  return !num ? randomized.slice(0, 1) : randomized.slice(0, num);
}

// Print student roster
// function printRoster(students) {
//   console.log('\n\t' + colors.bgCyan('Student Roster:'));
//   students.forEach(student => {
//     console.log('\t    ' + student);
//   });
//   console.log();
// }

// wrapper to ignore the other args passed by commander
function getPath(input) {
  return path.resolve(input);
}
