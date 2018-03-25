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

server.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
