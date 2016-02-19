// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var mongoUri = process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/amuseme";
var port = process.env.PORT || 3000;
var app = express();


// MIDDLEWARE
// -----------------------------------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// connect to mongo
mongoose.connect(mongoUri);


app.get("/", function(req, res) {
  res.redirect("/users"); // needs to be changed
});


var usersController = require("./controllers/usersController.js");
app.use("/users", usersController);

var promptsController = require("./controllers/promptsController.js");
app.use("/prompts", promptsController);



// LISTENER
// ---------------------------------------------------
mongoose.connection.once("open", function() {
  console.log("Connected to mongo.");
  app.listen(port, function(){
    console.log("Server is listening at: " + port);
  });
});