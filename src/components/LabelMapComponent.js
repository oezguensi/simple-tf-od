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
          user: {
              name: "John",
              email: "john@example.com"
          }
      })
    }).then(function(res) {
      console.log(res)
    });
  }

  return (
    <Button onClick={e => handleOnClick()}>
      Click me
    </Button>
  )
}

