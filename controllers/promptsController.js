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
  Prompt.find({}, {}, {limit: 5}, function(err, prompts) { // finds all prompt instances in collection
    // console.log(prompts); // confirms prompts
    res.render("prompts/index.ejs", {
      prompts: prompts, // renders prompts data with index.ejs
      pageNumber: 0 // set page number to 0
    });
  });
}); // end root route


// NEXT-- show next (#?) results
router.get("/pages/:page_number", function(req, res) {
  var pageNumber = parseInt(req.params.page_number); // convert param to an integer
  // pulls the next (#) of entries and saves to ender to show page
  // var morePrompts = true; // default value is true --> assumes that there are more prompts
  Prompt.find({}, {}, {limit: 5, skip: (5 * req.params.page_number)}, function(err, prompts) {
      res.render("prompts/index.ejs", {
        prompts: prompts, 
        pageNumber: pageNumber
      })
  });
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
        res.redirect("/prompts/" + promptData.id);
      });
    });
  });
});


// EDIT-- render edit form page
router.get("/edit/:response_id", isLoggedIn, function(req, res) {
  Response.findById(req.params.response_id, function(err, responseData) {
    console.log(responseData); // confirms information being passed
    res.render("prompts/edit.ejs", { 
      response: responseData
    });
  });
}); // end edit route


// UPDATE-- submit changes to db
router.put("/edit/:response_id", function(req, res) {

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


// SAVE
// this works and wont add duplicates... but i can only save the id number (model must be an empty array)
router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
  Prompt.findById(req.params.prompt_id, function(err, prompt) {
    User.update({_id: req.user.id}, {$addToSet: {savedPrompts: prompt.id}}, function(err, data) {
      console.log("hi")
      res.send("done")
    })
  })
}) 

// this works... but you can push the same prompt in multiple times
// router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
//   Prompt.findById(req.params.prompt_id, function(err, prompt) {
//     User.findByIdAndUpdate(req.user.id, 
//       {$push: {"savedPrompts": {promptid: prompt.id, promptBody: prompt.promptBody}}}, function(err, user) {
//         console.log(user);
//         res.send("done")
//       })
//   })
// })



// DELETE-- deletes a single response
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
        console.log("Deleted response!")
        res.redirect("/prompts/" + responseData.promptid);

        // Response.findByIdAndRemove(req.params.response_id, function(err, data) {
        //   console.log("Deleted response!");

        //   res.redirect("/prompts/" + responseData.promptid);
        // });
      });
    });
  });
}); // end delete response route


// RANDOM-- goes to random prompt show page
router.get("/random", function(req, res) {
  // find the number of instances in prompt collection
  Prompt.count({}, function(err, count) {
    console.log(count); // confirm count works

    // generate a random number using the count value
    var randomIndex = Math.floor(Math.random() * count);

    Prompt.findOne().skip(randomIndex).exec(function(err, prompt) {
      console.log(prompt); // confirms that a prompt is returned
      res.redirect("/prompts/" + prompt.id);
    });
  });
});


// SHOW-- shows one prompt
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
    res.redirect("/users/newaccount");

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


  // NEXT ROUTE... WAS TRYING TO USE QUERIES TO DISABLE SEARCH IF THERE WOULD BE NO MORE RESULTS 

  // NEXT-- show next (#?) results
  // router.get("/pages/:page_number", function(req, res) {
  //   var pageNumber = parseInt(req.params.page_number); // convert param to an integer
  //   // pulls the next (#) of entries and saves to ender to show page
  //   // var morePrompts = true; // default value is true --> assumes that there are more prompts
  //   Prompt.find({}, {}, {limit: 2, skip: (2 * req.params.page_number)}, function(err, prompts) {

  //     // check if there are more entries on potential next page
  //     Prompt.find({}, {promptBody: 1}, {limit: 2, skip: 4}, function(err, nextPrompt) {

  //       console.log("NEXT PROMPT");
  //       console.log(nextPrompt);

  //       // if (nextPrompt === 0) {
  //       //   var morePrompts = false; // set more prompts variable to false if there are none left

  //       // } else {
  //       //   var morePrompts = true;
  //       // }

  //       //   console.log("MORE PROMPTS")
  //       //   console.log(morePrompts)

  //       res.render("prompts/index.ejs", {
  //         prompts: prompts, // pass data from first query
  //         pageNumber: pageNumber
  //         // morePrompts: morePrompts
  //       })

  //     }) // closes inner prompt find

  //     // if there are no prompts to display
  //     // if (prompts.length == 0 ) {
  //     //   res.send("nothing is here");
  //     // }

  //     // display the page with the passed prompts
  //     // res.render("prompts/index.ejs", {
  //     //   prompts: prompts,
  //     //   pageNumber: pageNumber
  //     // });
  //   });
  // });
  
  // ------------------------------------------------------------- END NEXT ROUTE CODE


  // SAVE ROUTE-----------------------------------------------------------------------

  // SAVE-- save a prompt for later
// router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
  // check if user has already saved prompt to savedPrompts array
//   for (var i = 0; i < req.user.savedPrompts; i++) {
//     console.log("hi");
//   }
//   console.log(req.user.savedPrompts.promptid)
//   console.log(req.user.username)
// })
// this works... but you can push the same prompt in multiple times
// router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
//   console.log(req.user);
//   Prompt.findById(req.params.prompt_id, function(err, prompt) {
//     User.findByIdAndUpdate(req.user.id, 
//       {$push: {"savedPrompts": prompt.id}}, function(err, user) {
//         // console.log(user);
//         res.send("done")
//       })
//   })
// })
// router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
//   Prompt.findById(req.params.prompt_id, function(err, prompt) {
//     User.findById(req.user.id, function(err, user) {
//     console.log(user.savedPrompts.indexOf(prompt.id)); // returns -1 if not there
//     // })
//     // access database to update
//     User.findByIdAndUpdate(req.user.id, 
//       {$push: {"savedPrompts": {promptid: prompt.id, promptBody: prompt.promptBody}}}, function(err, user) {
//         console.log(user);
//         res.send("done")
//       })
//   } // close if statement
//     })

//   })
// })
// router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
//   Prompt.findById(req.params.prompt_id, function(err, prompt) {
//     // find the active user
//     User.findById(req.user.id, function(err, user) {
//       // console.log(user);
//       console.log(user.savedPrompts.indexOf(prompt.id)); // returns -1 if not there
//       // if prompt is not already saved, then save it
//       // if (user.savedPrompts.indexOf(prompt.id) === -1) {
//         // access the database (again) for update
//         User.findByIdAndUpdate(req.user.id, 
//           {$push: {"savedPrompts": {promptid: prompt.id, promptBody: prompt.promptBody}}}, function(err, user) {
//           console.log(user);
//         })

//       // } 
//     })
//   })
// })
// this works... but you can push the same prompt in multiple times
// router.put("/save/:prompt_id", isLoggedIn, function(req, res) {
//   Prompt.findById(req.params.prompt_id, function(err, prompt) {
//     User.findByIdAndUpdate(req.user.id, 
//       {$push: {"savedPrompts": {promptid: prompt.id, promptBody: prompt.promptBody}}}, function(err, user) {
//         console.log(user);
//         res.send("done")
//       })
//   })
// })
      // User.find({savedPrompts: prompt.id}, function(err, result) {
      //   console.log(result)
      //   console.log(!result.length); // returns true
      //   console.log(result <= 0); // returns true
      // })
// -------------------------------------------------------------------- END SAVE ROUTE



