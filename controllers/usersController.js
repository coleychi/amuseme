// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users.js");



// ROUTES
// -----------------------------------------------------------------
// SIGNUP-- create a new account
router.post("/signup", passport.authenticate("local-signup", { 
  failureRedirect: "/users"}), function(req, res) {
  res.send(req.user); // checks that data persists
  // res.redirect("/users/" + req.user.id);
});

// LOGOUT-- logout of account
router.get("/logout", function(req, res) {
  req.logout(); // built in function that will logout user
  res.redirect("/prompts");
});

// LOGIN-- access an existing account
router.post("/login", passport.authenticate("local-login", { 
  failureRedirect: "/usersss"}), function(req, res) { // CHANGE FAILURE REDIRECT
  // res.send(req.user); // checks accessible data
  res.redirect("/users/" + req.user.id);
});


// NEWPROMPT-- add a new prompt
router.post("/newprompt", function(req, res) {
  // save new prompt in prompts collection
  var newPrompt = new Prompt(req.body);
  console.log(newPrompt); // confirms newPrompt body content 
  newPrompt.save(function(err, promptData) { // saves new prompt to prompts collection
    console.log(promptData); // confirms newPrompt has been saved (should have unique id)

    // push into user's prompts
    User

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