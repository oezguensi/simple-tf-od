const { PythonShell } = require("python-shell");
const express = require('express')
const app = express()
const bodyParser = require("body-parser");

// TODO labelmapdict
var options = {
  pythonPath: '/anaconda3/envs/my-env/bin/python',
  args: ['--data_set=train',
    '--imgs_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/data/imgs',
    '--annotations_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/data/annotations',
    '--label_map_dict={"standard": 1, "security": 2, "motorsport": 3, "missing": 4}',
    '--out_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/records']
};

let runPy = new Promise(function(success, nosuccess) {
  PythonShell.run('/Users/oezguensi/Code/Other\ Projects/simple-tf-od/server/custom_create_pascal_tf_record.py', options, function (err, results) {
    success(results);
    if (err) nosuccess(err);
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/posts', function(req, res){
    runPy.then(function(fromRunpy) {
      console.log(req.body);
      res.send('ran python script')
    });
});

app.listen(4000, () => console.log('Application listening on port 4000!'))