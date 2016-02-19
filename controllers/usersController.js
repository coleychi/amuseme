// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var passport = require("passport");
var User = require("../models/users.js");
var router = express.Router();



// ROUTES
// -----------------------------------------------------------------
router.get("/", function(req, res) {
  res.render("users/index.ejs")
})

// CREATE-- new user (authentication)
// router.post("/signup", function(req, res) {
//   console.log(req.body)
//   var newUser = new User(req.body);
//   console.log(newUser);
//   newUser.save(function(err, data) {
//     console.log("added");
//     res.redirect("/")
//   })
// })

router.post("/signup", passport.authenticate("local-signup", { 
  failureRedirect: "/users"}), function(req, res) {
  res.send(req.user); // checks that data persists
  // res.redirect("/users/" + req.user.id);
});




// EXPORT
// -----------------------------------------------------------------
module.exports = router;