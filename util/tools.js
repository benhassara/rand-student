const csv = require('fast-csv');
const path = require('path');

/* Load student list from CSV file.
 */
function load(file) {
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

// wrapper to ignore the other args passed by commander
function getPath(input) {
  return path.resolve(input);
}

// Remove instructors from list so chunking works
function removeInstructors(students) {
  let instructors = [
    'Wes Reid',
    'Michael Herman',
    'Rob Hajek',
    'Ben Hassara'
  ];
  return students.filter(name => instructors.indexOf(name) === -1);
}

module.exports = {
  load: load,
  getPath: getPath,
  removeInstructors: removeInstructors
};
