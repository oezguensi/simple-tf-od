const { PythonShell } = require("python-shell");
const express = require('express')
const app = express()
const bodyParser = require("body-parser");

const runPythonScript = (filePath, options) => {
  return new Promise((resolve, reject) => {
    let pyShell = new PythonShell(filePath, options);
    pyShell.on('message', function (message) {
      if (message.startsWith('Exception occured')) {
        reject(Error(`An exception occured while running python script: ${message}`));
      } else {
        console.log(message);
      }
    });

    pyShell.end(function (err, code) {
      if (err) {
        reject(Error(`An error occured when runnig python script: ${err}`)); 
      } else {
        resolve('Finished running python script!');
      }
      console.log('The exit code was: ' + code);
    });
  });
};


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/posts', function (req, res) {
  const options = {
    pythonPath: '/anaconda3/envs/my-env/bin/python',
    args: req.body.flags
  };

  runPythonScript(req.body.filePath, options).then(result => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  });
});

app.listen(4000, () => console.log('Application listening on port 4000!'))