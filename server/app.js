const { PythonShell } = require("python-shell");
const express = require('express')
const app = express()

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

app.get('/', (req, res) => {
  res.write('welcome\n');

  runPy.then(function(result) {
      console.log('Ran Python script');
      res.end(result);
  });
})

app.listen(4000, () => console.log('Application listening on port 4000!'))