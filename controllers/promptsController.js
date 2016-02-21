// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var router = express.Router();
var Prompt = require("../models/prompts.js");
var Response = require("../models/responses.js");
var User = require("../models/users.js");



// ROUTES
// -----------------------------------------------------------------
// INDEX
router.get("/", function(req, res) {
  Prompt.find({}, function(err, prompts) { // finds all prompt instances in collection
    // console.log(prompts); // confirms prompts
    res.render("prompts/index.ejs", {
      prompts: prompts // renders prompts data with index.ejs
    });
  });
});


// SHOW
router.get("/:prompt_id", function(req, res) {
  Prompt.findById(req.params.prompt_id, function(err, promptData) { // finds prompt instance by id using params
    res.render("prompts/show.ejs", {
      prompt: promptData // renders prompt instance with show.ejs
    });
  });
});


// NEWRESPONSE-- add a new response 
router.post("/:prompt_id/newresponse", isLoggedIn, function(req, res) {
  // console.log(req.user); // confirms req.user is accessible
  
  // save new response to responses collection
  var newResponse = new Response(req.body);
  console.log(newResponse); // confirms newResponse body content
  newResponse.save(function(err, responseData) { // saves new response to response collection on db
    // console.log(responseData); // confirms newResponse has been saved
    // console.log(responseData.id)
    // console.log(req.user.username)

    // add the user to the response instance
    Response.findByIdAndUpdate(responseData.id, {
      $set: {
        author: req.user.username, // sets author to the logged in user
        authorid: req.user.id,  // saves the author id 
        promptid: req.params.prompt_id} // saves the parent prompt id 
      }, {new: true}, function(err, responseData) {
        // console.log(responseData); // confirms update

        // add the promptBody to the response instance
        Prompt.findById(req.params.prompt_id, function(err, prompt) { // finds the prompt by id
          // console.log(prompt.promptBody);
          // console.log(responseData)
          Response.findByIdAndUpdate(responseData.id, {
            $set: {promptBody: prompt.promptBody} // set promptBody in response document
          }, {new: true}, function(err, responseData) {
            // console.log(responseData); // confirms promptBody was added

            prompt.responses.push(responseData); // push new response to prompt's responses array
            prompt.save(function(err, data) { // saves change to database
              console.log("response saved to prompt!");

              //push into user's responses array and save
              User.findById(req.user.id, function(err, user) {
                user.responses.push(responseData); // push new response to user's responses array
                user.save(function(err, data) { // saves change to database
                  console.log("response saved to user");
                  res.redirect("/prompts/" + prompt.id)
                });
              });

            });
          });

        });
      });
    });
});




// RANDOM



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

  // SECOND HALF OF THE ORIGINAL NEW RESPONSE ROUTE -------------------------------------
        // // push into prompt's responses array and save
        // Prompt.findById(req.params.prompt_id, function(err, prompt) {
        //   // console.log(prompt); // confirms prompt instance being grabbed
        //   prompt.responses.push(responseData); // push new response to prompt's responses array
        //   prompt.save(function(err, data) { // saves change to database
        //     console.log("response saved to prompt"); 

        //   // console.log(req.user.id); // confirms req.user is still accessible 

        //     // push into user's responses array and save
        //     User.findById(req.user.id, function(err, user) {
        //       // console.log(user); // confirms user instance being grabbed
        //       // console.log(responseData); // confirms responseData accessible
        //       user.responses.push(responseData); // push new response to user's responses array
        //       user.save(function(err, data) { // saves change to database
        //         console.log("response saved to user"); 
        //         res.redirect("/prompts/" + prompt.id); // change to a redirect or something

        //       });
        //     });

        //   });
        // });
  // ------------------------------------- end second half of original new response route

