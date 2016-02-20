// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var router = express.Router();
var Prompt = require("../models/prompts.js");
var Response = require("../models/responses.js")



// ROUTES
// -----------------------------------------------------------------
// INDEX
router.get("/", function(req, res) {
  Prompt.find({}, function(err, prompts) {
    console.log(prompts);
    res.render("prompts/index.ejs", {
      prompts: prompts
    });
  });
});


// SHOW
router.get("/:prompt_id", isLoggedIn, function(req, res) {
  Prompt.findById(req.params.prompt_id, function(err, promptData) {
    res.render("prompts/show.ejs", {
      prompt: promptData
    });
  });
});


// NEWRESPONSE-- add a new response 
router.post("/:prompt_id/newresponse", isLoggedIn, function(req, res) {

  console.log(req.user); // confirms req.user is accessible
  
  // save new response to responses collection
  var newResponse = new Response(req.body);
  console.log(newResponse); // confirms newResponse body content
  newResponse.save(function(err, responseData) { // saves new response to response collection on db
    console.log(responseData); // confirms newResponse has been saved

    // push into prompt's responses array
    Prompt.findById(req.params.prompt_id, function(err, prompt) {
    console.log(prompt); // confirms instance being grabbed
    prompt.responses.push(responseData); // push new response to prompt's responses array
    prompt.save(function(err, data) { // saves change to database
      console.log("response saved to prompt"); 
    });
  });




  });


  // var newPrompt = new Prompt(req.body);
  // // console.log(newPrompt); // confirms newPrompt body content 
  // newPrompt.save(function(err, promptData) { // saves new prompt to prompts collection
  //   // console.log(promptData); // confirms newPrompt has been saved (should have unique id)
  //   // console.log(req.user.id); // confirms logged in user info is accessible
    
  //   // push into user's prompts
  //   User.findById(req.user.id, function(err, user) {
  //     console.log(user); // confirms instance being grabbed
  //     user.prompts.push(promptData); // push new prompt to user's prompts array
  //     user.save(function(err, data) { // saves the change to the database
  //       console.log("new prompt saved!");
  //       res.redirect("/users/" + user.id);
  //     });
  //   });
  // });
});






// EXPORT
// -----------------------------------------------------------------
module.exports = router;

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