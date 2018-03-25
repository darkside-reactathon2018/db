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
  request.get('https://data.abut27.hasura-app.io/v1alpha1/graphql/users').on('response', (response) => {
  console.log('status: ', response.statusCode);
}); });

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
