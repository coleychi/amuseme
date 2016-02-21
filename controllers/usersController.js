// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users.js");
var Prompt = require("../models/prompts.js");



// ROUTES
// -----------------------------------------------------------------
// INDEX-- users root index (FOR TEST PURPOSES ONLY)
router.get("/", function(req, res) {
  res.redirect("/prompts");
});


// SIGNUP-- create a new account
router.post("/signup", passport.authenticate("local-signup", { 
  failureRedirect: "/userssss"}), function(req, res) {
  // res.send(req.user); // checks that data persists
  res.redirect("/users/" + req.user.id); // possibly change redirect to prompts
});

// LOGOUT-- logout of account
router.get("/logout", function(req, res) {
  req.logout(); // built in function that will logout user
  res.redirect("/users");
});

// LOGIN-- access an existing account
router.post("/login", passport.authenticate("local-login", { 
  failureRedirect: "/users/newaccount"}), function(req, res) { // CHANGE FAILURE REDIRECT-- set to dummy route
  // res.send(req.user); // checks accessible data
  // res.locals.user = req.user;
  res.redirect("/prompts");
});


// NEW ACCOUNT-- create a new account
router.get("/newaccount", function(req, res) {
  res.render("users/signup.ejs");
});


// NEWPROMPT-- add a new prompt
router.post("/newprompt", isLoggedIn, function(req, res) {
  
  // save new prompt in prompts collection
  var newPrompt = new Prompt(req.body);
  // console.log(newPrompt); // confirms newPrompt body content 
  newPrompt.save(function(err, promptData) { // saves new prompt to prompts collection
    // console.log(promptData); // confirms newPrompt has been saved (should have unique id)
    // console.log(req.user.id); // confirms logged in user info is accessible
    
    // push into user's prompts
    User.findById(req.user.id, function(err, user) {
      console.log(user); // confirms instance being grabbed
      user.prompts.push(promptData); // push new prompt to user's prompts array
      user.save(function(err, data) { // saves the change to the database
        console.log("new prompt saved!");
        res.redirect("/users/" + user.id);
      });
    });
  });
});


// SHOW-- user's show page... convert username to userid
router.get("/username/:username", function(req, res) {
  User.findOne({username: req.params.username}, function(err, user) {
    console.log(user.id)
    res.redirect("/users/" + user.id)
  })
})


// SHOW-- user's show page
router.get("/:user_id", isLoggedIn, function(req, res) {
  User.findById(req.params.user_id, function(err, userData) {
    res.render("users/show.ejs", {
      user: userData
    });
  });
});





// MIDDLEWARE
// -----------------------------------------------------------------
// ensure a user is loggedin
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, continue
  if (req.isAuthenticated()) {
    
    return next();
  } else {

  // if they aren't redirect them to the homepage
  res.redirect("/");
  
  }; 
};



// EXPORT
// -----------------------------------------------------------------
module.exports = router;