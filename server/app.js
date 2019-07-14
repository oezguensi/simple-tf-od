const { PythonShell } = require("python-shell")
const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const runPythonScript = (filePath, options) => {
  return new Promise((resolve, reject) => {
    let pyShell = new PythonShell(filePath, options)
    pyShell.on('message', function (message) {
      if (message.startsWith('Exception occured')) {
        reject(Error(`An exception occured while running python script: ${message}`))
      } else {
        console.log('should send')
        resolve(message)
        console.log(message)
      }
    })

    pyShell.end(function (err, code) {
      if (err) {
        reject(Error(`An error occured when runnig python script: ${err}`)) 
      } else {
        resolve('Finished running python script!')
      }
      console.log('The exit code was: ' + code)
    })
  })
}


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Content-Type-Options, Origin, X-Requested-With, Content-Type, Accept")
  next()
})
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
app.use(bodyParser.json())

app.post('/posts', function (req, res, next) {
  res.writeHead(200, {
    'Connection': 'Transfer-Encoding',
    'Content-Type': 'text/plain charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'X-Content-Type-Options': 'nosniff'
  })

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: '/anaconda3/envs/my-env/bin/python',
    args: req.body.flags
  }

  let pyShell = new PythonShell(req.body.filePath, options)
  pyShell.on('message', function (message) {
    if (message.startsWith('Exception occured')) {
      res.end(message)
    } else {
      res.write(message)
      res.flush()
      
    }
  })

  pyShell.end(function (err, code) {
    if (err) {
      res.end(Error(`An error occured when runnig python script: ${err}`)) 
    } else {
      res.end('Finished running python script!')
    }
    console.log('The exit code was: ' + code)
  })
  next()
})

app.listen(4000, () => console.log('Application listening on port 4000!'))