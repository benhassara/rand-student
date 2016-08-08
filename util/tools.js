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

module.exports = {
  load: load,
  getPath: getPath
};
