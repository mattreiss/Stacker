const bodyParser = require('body-parser');
const path = require('path')
const fetch = require('node-fetch');
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Thread = require('child_process');

const SERVER_PORT = 1337;
const PATH_TO_SCRIPTS = path.resolve(__dirname, '../sh');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


function execute(script, callback, onError) {
  console.log("Executing script " +  script)
  Thread.exec(PATH_TO_SCRIPTS + "/" + script,
    function (error, stdout, stderr) {
      stdout && console.log(script + " stdout " + stdout)
      stderr && console.log(script + " stderr " + stderr)
      error && console.log(script + " error " + error)
      callback(stdout)
      var errorMessage = stderr || error;
      if (errorMessage && onError) onError(errorMessage)
    });
}

function spawn(script, args, callback, onError, onComplete) {
  console.log("Executing script " +  script, args)
  const stream = Thread.spawn(PATH_TO_SCRIPTS + "/" + script, args);
  stream.stdout.on('data', callback);
  stream.stderr.on('data', onError);
  stream.on('close', function(code) {
    console.log("Finished excecuting script", script, code);
    if (onComplete) onComplete();
  })
}

app.post('/run', function (req, res) {
  console.log("/run req.body", req.body)
  const command = req.body.command
  const args = req.body.args
  const params = [command]
  if (args && args.length > 0) {
    for (var i in args) params.push(args[i])
  }
  spawn("run.sh", params, function(result) {
    io.emit('result', { result: result });
  }, function(error) {
    io.emit('error', { error: error });
  })
  res.send("running");
})

app.post('/list', function (req, res) {
  const directory = req.body.directory
  app.use('/directory', express.static(directory));
  execute("list.sh " + directory, function(result) { res.send(result) })
})


io.on('connection', function(socket){
  console.log('a user connected');
});

var server = http.listen(SERVER_PORT, function () {
  console.log("listening on port", SERVER_PORT)
})
