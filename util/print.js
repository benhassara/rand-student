const _ = require('lodash');
const ora = require('ora');
const colors = require('colors');

function countdown(countdown, headers) {
  return new Promise(function(resolve, reject) {
    let header = _.sample(headers);
    let timeLeft = countdown;
    let spinner = new ora({
      text: spinnerText(timeLeft, header),
      spinner: 'clock',
      color: _.sample(['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'])
    });

    // start with a newline
    console.log();
    spinner.start();
    // save reference to clear the interval
    // and update timeLeft for display
    let interval = setInterval(() => {
      --timeLeft;
      spinner.text = spinnerText(timeLeft, header);
    }, 1000);

    // overall countdown timer to stop the spinner
    setTimeout(() => {
      spinner.text = spinnerText(0, header);
      spinner.succeed();
      clearInterval(interval);
      resolve();
    }, 1000 * countdown);
  });
  // helper to format the spinner's text
  function spinnerText(timeLeft, header) {
    return timeLeft ?
           '\t' + timeLeft + ' ' + colors.bold.underline(header + ':') + ' ' + timeLeft :
           '\t  ' + colors.bold.underline(header + ':');
  }
}

// Logs the selected students to the terminal.
function students(students) {
  let prefix = '\t    ';
    students.forEach(student => {
      console.log(prefix + student);
    });
    console.log();
}

// Print out the whole student roster.
function roster(roster) {
  let prefix = '\t    ';
  console.log('\n\t' + colors.bgCyan('Student Roster:'));
  roster.forEach(student => {
    console.log(prefix + student);
  });
  console.log();
}

/* Print chunked students
 *    chunks = [[chunk1], [chunk2], ...] */
function chunks(chunks) {
  let prefix = '\t    ';
  chunks.forEach((chunk, i) => {
    let groupLn = colors.underline(`Group ${i + 1}:`)
    console.log('\n\t' + groupLn);
    console.log(`${prefix}${chunk.join('\n' + prefix)}`);
  });
  console.log();
}

module.exports = {
  countdown: countdown,
  students: students,
  roster: roster,
  chunks: chunks
};
