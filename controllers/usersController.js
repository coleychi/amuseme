// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users.js");
var Prompt = require("../models/prompts.js");
var Response = require("../models/responses.js");



// ROUTES
// -----------------------------------------------------------------
// INDEX-- users root index redirects to prompts root
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


// SHOW-- user's show page... convert username to userid
router.get("/username/:username", function(req, res) {
  User.findOne({username: req.params.username}, function(err, user) {
    console.log(user.id)
    res.redirect("/users/" + user.id)
  })
})


// SHOW-- user's show page (profile)
router.get("/:user_id", isLoggedIn, function(req, res) {
  User.findById(req.params.user_id, function(err, userData) {
    res.render("users/show.ejs", {
      user: userData
    });
  });
});


// SHOW-- shows a specific response to a prompt
router.get("/response/:response_id", function(req, res) {
  Response.findById(req.params.response_id, function(err, responseData) {
    res.render("users/response.ejs", {
      response: responseData
    });
  })
})


// DELETE-- deletes a single response (same as prompts controller route, different redirect)
router.delete("/delete/:response_id", function(req, res) {

  // grab the specific response instance from db
  Response.findById(req.params.response_id, function(err, responseData) {

    // pull response instance from user's responses array
    User.findByIdAndUpdate(req.user.id, {$pull: {responses: {_id: req.params.response_id}}}, {new: true}, function(err, user) {
      // console.log(user);

      // pull response instance from prompt's responses array
      Prompt.findByIdAndUpdate(responseData.promptid, {$pull: {responses: {_id: req.params.response_id}}}, {new:true}, function(err, prompt) {
        // console.log(prompt);

        // delete the original response from the response collection
        responseData.remove();
        console.log("Deleted response!");
        res.redirect("/users/" + user.id);
        
        // Response.findByIdAndRemove(req.params.response_id, function(err, data) {
        //   console.log("Deleted response!");

        //   res.redirect("/users/" + user.id);
        // });
      });
    });
  });
}); // end delete response route


// DELETE-- delete's the user's profile (deletes all responses but does not remove prompts)
router.delete("/deleteaccount/:user_id", function(req, res) {
  // res.send("route is right"); // checks route

  // grabs the specific user instance
  User.findById(req.params.user_id, function(err, user) {


    // delete responses from parent prompts
    // find all responses whose auther is equal to the user's username
    Response.find({author: user.username}, function(err, userContributions) {
      // console.log("USER CONTRIBUTIONS================")
      // console.log(userContributions[0])
      // console.log(userContributions[0].id)

      // for loop-- for every response in the query array
      for (var i = 0; i < userContributions.length; i++) {

        // grab the parent prompt using the key/value in userContributions query result.
        Prompt.findByIdAndUpdate(userContributions[i].promptid, {$pull: {
          // pull the response from the prompt object that matches the response id from the user query array
          responses: {_id: userContributions[i]._id}}}, {new: true}, function(err, data) {
            console.log("pulled responses from prompts");
          });

            // remove the response from the response collection
            Response.findByIdAndRemove(userContributions[i].id, function(err, data) {
              console.log("gone?")
        });

      } // closes for loop 

      // delete the user document from db
      user.remove(); // removes the user
      res.redirect("/prompts");

    });
  });
});



// EDIT PROFILE
router.get("/editprofile/:user_id", function(req, res) {
  res.render("users/edit.ejs");
});


// UPDATE
router.put("/editprofile/:user_id", function(req, res) {
  // console.log("THIS IS REQ BODY");
  // console.log(req.body);
  User.findByIdAndUpdate(req.params.user_id, {$set: {about: req.body.about}}, {new: true}, function(err, user) {
    console.log("Updated user profile");
    res.redirect("/users/" + user.id);
    // res.redirect("/users/" + user.id);
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






// SCRAP CODE

// moved to prompts controller -----------------------------
// // NEWPROMPT-- add a new prompt
// router.post("/newprompt", isLoggedIn, function(req, res) {
  
//   // save new prompt in prompts collection
//   var newPrompt = new Prompt(req.body);
//   // console.log(newPrompt); // confirms newPrompt body content 
//   newPrompt.save(function(err, promptData) { // saves new prompt to prompts collection
//     // console.log(promptData); // confirms newPrompt has been saved (should have unique id)
//     // console.log(req.user.id); // confirms logged in user info is accessible
    
//     // push into user's prompts
//     User.findById(req.user.id, function(err, user) {
//       console.log(user); // confirms instance being grabbed
//       user.prompts.push(promptData); // push new prompt to user's prompts array
//       user.save(function(err, data) { // saves the change to the database
//         console.log("new prompt saved!");
//         res.redirect("/users/" + user.id);
//       });
//     });
//   });
// });
