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
}); // end root route


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


// EDIT-- render edit form page
router.get("/:response_id/edit", isLoggedIn, function(req, res) {
  Response.findById(req.params.response_id, function(err, responseData) {
    console.log(responseData); // confirms information being passed
    res.render("prompts/edit.ejs", { 
      response: responseData
    });
  });
}); // end edit route


// UPDATE-- submit changes to db
router.put("/:response_id", function(req, res) {

  // update the specific response in responses collection
  Response.findByIdAndUpdate(req.params.response_id, req.body, {new: true}, 
    function(err, responseData) {
      // console.log("FOUND THE INSTANCE!");
      // console.log(responseData);
      // console.log("response updated");
      // console.log(req.body);

      // update the response in prompts collection
      Prompt.update({"responses._id": req.params.response_id}, {$set: {
        "responses.$.responseBody" : responseData.responseBody
      }}, function(err, prompt) {
        // console.log(prompt); 

        // update the response in the users collection
        User.update({"responses._id": req.params.response_id}, {$set: {
          "responses.$.responseBody" : responseData.responseBody
        }}, function(err, user) {
          // console.log("USER DATA--------");
          // console.log(user);
          res.redirect("/prompts/" + responseData.promptid);
        });
      }); 
    });
}); // end put route 




// DELETE RESPONSE




// SHOW
router.get("/:prompt_id", function(req, res) {
  Prompt.findById(req.params.prompt_id, function(err, promptData) { // finds prompt instance by id using params
    res.render("prompts/show.ejs", {
      prompt: promptData // renders prompt instance with show.ejs
    });
  });
}); // end :prompt_id show route


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
}); // end new response route




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

