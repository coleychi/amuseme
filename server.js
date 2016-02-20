// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var morgan = require("morgan");
var passport = require("passport");
var session = require("express-session");
var mongoUri = process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/amuseme";
var port = process.env.PORT || 3000;
var app = express();



// MIDDLEWARE
// -----------------------------------------------------------------
// connect to mongo
mongoose.connect(mongoUri);

// passport requirement
require("./config/passport")(passport); 

// require controllers
var usersController = require("./controllers/usersController.js");
var promptsController = require("./controllers/promptsController.js");

// access static public folder
app.use(express.static("public"));

// configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure cookie-parser
app.use(cookieParser());

// configure method-override
app.use(methodOverride("_method"));

//configure morgan
app.use(morgan("dev")); 

// configure passport
app.use(session({ secret: "amusemeamuseme", resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session());

// set global variable equal to boolean value of user state (logged in/not logged in)
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated(); // authenticate user
  // res.locals.user = req.user; // save user data
  next();
});

// use usersController for /users
app.use("/users", usersController);

// use promptsController for /prompts
app.use("/prompts", promptsController);

// redirect root index to /users
app.get("/", function(req, res) {
  res.redirect("/prompts"); // needs to be changed
});



// LISTEN
// ---------------------------------------------------
app.listen(port, function() {
    console.log("Listening on port: "+ port);
});