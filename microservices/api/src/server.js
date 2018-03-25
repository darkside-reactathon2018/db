var express = require('express');
var app = express();
var request = require('request');
var router = express.Router();
var morgan = require('morgan');
var bodyParser = require('body-parser');
require('request-debug')(request);

var exampleRouter = require('./routeExample');

var server = require('http').Server(app);

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

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
