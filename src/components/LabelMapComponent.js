import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default function LabelMap() {
  const handleOnClick = () => {
    fetch('http://localhost:4000/posts', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filePath: '/Users/oezguensi/Code/Other\ Projects/simple-tf-od/server/custom_create_pascal_tf_record.py',
        flags: ['--data_set=train',
          '--imgs_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/data/imgs',
          '--annotations_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/data/annotations',
          '--label_map_dict={"standard": 1, "security": 2, "motorsport": 3, "missing": 4}',
          '--out_dir=/Users/oezguensi/Code/Other\ Projects/simple-tf-od/records'],
        user: {
          name: "John",
          email: "john@example.com"
        }
      })
    }).then(function (res) {
      console.log(res)
    });
  }

  return (
    <Button onClick={e => handleOnClick()}>
      Click me
    </Button>
  )
}

