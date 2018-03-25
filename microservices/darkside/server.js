// Dependencies
var express = require("express"),
  OpenTok = require("opentok");

// Verify that the API Key and API Secret are defined
var apiKey = process.env.API_KEY,
  apiSecret = process.env.API_SECRET;
if (!apiKey || !apiSecret) {
  console.log("You must specify API_KEY and API_SECRET environment variables");
  process.exit(1);
}

// Initialize the express app
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(__dirname + "/public"));

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store it in the express app
opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set("sessionId", session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get("/", function(req, res) {
  var sessionId = app.get("sessionId"),
    // generate a fresh token for this client
    token = opentok.generateToken(sessionId);

  res.json({
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});

// Start the express app
function init() {
  app.listen(8080, function() {
    console.log("You're app is now ready at http://localhost:8080/");
  });
}
