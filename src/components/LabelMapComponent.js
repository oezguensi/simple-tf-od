import React from 'react'
import Button from '@material-ui/core/Button'
var Loader = require('react-loader')

const spinnerOptions = {
  lines: 8,
  length: 0,
  width: 32,
  radius: 39,
  scale: 0.75,
  corners: 1,
  color: '#a9ddff',
  fadeColor: 'transparent',
  speed: 0.9,
  rotate: 0,
  animation: 'spinner-line-fade-more',
  direction: 1,
  zIndex: 2e9,
  className: 'spinner',
  top: '50%',
  left: '50%',
  position: 'absolute'
}

export default class LabelMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  handleOnClick() {
    this.setState({ loading: true })
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
      })
    }).then(res => {
      console.log('Response:', res)
      this.setState({ loading: false })
    }).catch(err => {
      console.log('Error occured', err)
    })
  }

  render() {
    return (
      <div>
        <Loader loaded={!this.state.loading} options={spinnerOptions} className="spinner" />
        <Button onClick={() => this.handleOnClick()}>
          Click me
        </Button>
      </div>
    )
  }
}