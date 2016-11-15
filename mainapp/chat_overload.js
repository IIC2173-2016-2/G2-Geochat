const execFile = require('child_process').execFile;


execFile('node', ['--version'], (error, stdout) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
