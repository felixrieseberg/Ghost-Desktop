const exec = require('child_process').exec;

exec(`${__dirname}/../assets/icons/make-iconset.sh`, (error, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
