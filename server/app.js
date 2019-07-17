const { PythonShell } = require("python-shell")
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const execSync = require('child_process').execSync
const { spawn } = require('child_process')


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Content-Type-Options, Origin, X-Requested-With, Content-Type, Accept")
  next()
})
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
app.use(bodyParser.json())

app.post('/scripts/chunked', function (req, res, next) {
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
      console.log(message)
      res.end(message)
    } else {
      console.log(message)
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


app.post('/scripts/full', function (req, res, next) {
  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: '/anaconda3/envs/my-env/bin/python',
    args: req.body.flags
  }

  let pyShell = new PythonShell(req.body.filePath, options)
  pyShell.on('message', function (message) {
    if (message.startsWith('Exception occured')) {
      console.log(message)
      res.end(message)
    } else {
      console.log(message)
      res.end(message)
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


// app.post('/shell', function (req, res, next) {
//   const output = execSync(req.body.command, { encoding: 'utf-8' });  // the default is 'buffer'
//   console.log('Output was:\n', output);
// })


// const startReadingChunkedResponse = (response) => {
//   var reader = response.body.getReader()
//   return reader.read().then(result => processChunks(result, reader));
// }

// const processChunks = (result, reader) => {
//   if (!result.done) {
//     setProgress(progress + 5)
//     return reader.read().then(result => processChunks(result, reader));
//   }
// }



app.post('/shell', function (req, res, next) {
  const child = spawn('cd ..')
  // use child.stdout.setEncoding('utf8'); if you want text chunks
  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (chunk) => {
    console.log(chunk)
  })

  // since these are streams, you can pipe them elsewhere
  // child.stderr.pipe(dest);

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  })

})


app.listen(4000, () => console.log('Application listening on port 4000!'))