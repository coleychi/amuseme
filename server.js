// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
var mongoUri = process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/amuseme";
var app = express();



// MIDDLEWARE
// -----------------------------------------------------------------
// connect to mongo
mongoose.connect(mongoUri);

// configure morgan
app.use(morgan("dev"));

// require controllers
var promptsController = require("./controllers/promptsController.js");





// redirect root index to /prompts
app.get("/", function(req, res) {
  res.send("Hi"); // confirms root index is accessible
});



app.use("/prompts", promptsController);






// LISTEN
// -----------------------------------------------------------------
app.listen(port, function() {
  console.log("Running on port: " + port);
});