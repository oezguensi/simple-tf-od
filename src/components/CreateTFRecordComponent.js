import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertDialogSlide from './AlertComponent'

export default class CreateTFRecord extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      onComplete: props.onComplete,
      loading: false,
      progress: 0,
      alertCompleted: false
    }

    this.startReadingChunkedResponse = this.startReadingChunkedResponse.bind(this)
    this.processChunks = this.processChunks.bind(this)
    this.onChunkedResponseComplete = this.onChunkedResponseComplete.bind(this)
  }

  startReadingChunkedResponse(response) {
    var reader = response.body.getReader()
    return reader.read().then(result => this.processChunks(result, reader));
  }

  processChunks(result, reader) {
    if (!result.done) {
      this.setState({progress: this.state.progress + 5})
      return reader.read().then(result => this.processChunks(result, reader));
    }
  }
  
  onChunkedResponseComplete(result) {
    this.setState({progress: 100})
    setTimeout(() => { 
      this.setState({loading: false, alertCompleted: true})
      console.log('Finished process!', result)  
    }, 2000);
    
  }
  
  onChunkedResponseError(err) {
    console.error(err)
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
    }).then(this.startReadingChunkedResponse).then(this.onChunkedResponseComplete).catch(this.onChunkedResponseError)
  }

  handleOnDialogClose() {
    this.setState({alertCompleted: false})
    this.state.onComplete()
  }

  render() {
    return (
      (this.state.loading ?
        <CircularProgress variant="static" value={this.state.progress} />
        :
        (this.state.alertCompleted ? 
          <AlertDialogSlide onDialogClose={() => this.handleOnDialogClose()}/>
        :  
          <Button variant="contained" color="primary" onClick={() => this.handleOnClick()}>
            Download
          </Button>
        )
      )
    )
  }
}