const _ = require('lodash');
const ora = require('ora');
const colors = require('colors');

function countdown(countdown, headers) {
  return new Promise(function(resolve, reject) {
    var header = _.sample(headers);
    var timeLeft = countdown;
    var spinner = new ora({
      text: spinnerText(timeLeft, header),
      spinner: 'clock',
      color: _.sample(['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'])
    });

    // start with a newline
    console.log();
    spinner.start();
    // save reference to clear the interval
    // and update timeLeft for display
    var interval = setInterval(() => {
      --timeLeft;
      spinner.text = spinnerText(timeLeft, header);
    }, 1000);

    // overall countdown timer to stop the spinner
    setTimeout(() => {
      spinner.text = spinnerText(0, header);
      spinner.succeed();
      clearInterval(interval);
      resolve();
    }, 3000);
  });
  // helper to format the spinner's text
  function spinnerText(timeLeft, header) {
    return timeLeft ?
           '\t' + timeLeft + ' ' + colors.bold.underline(header + ':') + ' ' + timeLeft :
           '\t  ' + colors.bold.underline(header + ':');
  }
}

module.exports = {
  countdown: countdown
};
