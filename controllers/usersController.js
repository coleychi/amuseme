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
  res.redirect("/prompts");
});



// EXPORT
// -----------------------------------------------------------------
module.exports = router;