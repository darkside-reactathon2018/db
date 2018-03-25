var express = require('express');
var app = express();
var request = require('request');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
require('request-debug')(request);

io.on('connection', function(socket){
  socket.on('user:request', function(msg) {
    socket.emit('user:accept', { id : 1 });
    socket.broadcast.emit('user:join');
  });

  socket.on('send:message', function(msg) {
    io.emit('send:message', msg);
  });

  socket.on('disconnect', function(msg) {
    socket.broadcast.emit('user:left', msg);
  })
});


var exampleRouter = require('./routeExample');

router.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', exampleRouter);

app.get('/users', () => {
  request.headers({
    'content-type': 'application/json',
    'authorization': 'Bearer 3bbe89c0a2a6844f60a5dfd3aaf4b7dae2cf3aa96fc4f436'
  });
  request.body({
    "type" : "select",
    "args" : {
        "table" : "users",
        "columns": ["id", "username", "firstname", "lastname", "gender"]
    }
  });
  request.post('https://data.abut27.hasura-app.io/v1/query').on('response', response => {
    console.log('status: ', response.statusCode);
    console.log('res:', response);
  });
});

server.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

// =======
//app.listen(8080, function () {