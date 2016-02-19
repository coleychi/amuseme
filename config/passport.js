var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/users.js");

// module.export the passport functionality
module.exports = function(passport) {

  // serialize user-- dertermines what user information will be stored in the session
  passport.serializeUser(function(user, done) {
    done(null, user.id); // store the user id inside the session
  });

  // deserialize user-- persistent sessions
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // SIGNUP STRATEGY

  // interacts with database
  passport.use("local-signup", new LocalStrategy({
    usernameField: "username", // passport defaults. can only use two fields here (username, passport)
    passwordField: "password",
    passReqToCallback: true // passes entire request to the callback-- req.body accessible
  },

  function(req, username, password, done) {

    // User.findOne wont fire unless data is sent back
    process.nextTick(function() { 

      // find a user whose username is the same as the forms username 
      // (checking to see if user trying to log in exists)
      User.findOne({"username": username}, function(err, user) {

        // if there is an error, return the error
        if (err)
          return done(err)

        // check if there's a user with the email
        if(user) {
          return done(null, false);
        } else {

          // if there is no user with the email, create the user
          var newUser = new User();

          // set user's local credentials
          // console.log(req.body); // confirms req.body is accessible

          newUser.username = username;
          newUser.password = newUser.generateHash(password); // calls method inside users model
          newUser.email = req.body.email; // call upon req.body to set email

          // save user
          newUser.save(function(err) {
            if(err)
              throw err;
            return done(null, newUser)
          });
        }

      });

    });

  })); // closes signup strategy


  // LOGIN STRATEGY
  passport.use("local-login", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  },

  function(req, username, password, done) {

    // console.log("req.body:"); 
    console.log(req.body); // confirming that info is being grabbed

    // find user with username that matches the username in form
    // checking if user trying to login already exists
    User.findOne({"username": username}, function(err, user) {

      // console.log(user); // checks object being accessed

      // if there is an error, return the error
      if (err) {
        console.log("error?");
        return done(err);
      }

      // if no user is found, return the message (no message because no flash)
      if (!user) {
        console.log("no user");
        return done(null, false);
      }

      // if the user is found, but the password does not match
      if (!user.validPassword(password)){
        console.log("wrong password");
        return done(null, false);
      }

      // no problems, return user
      return done(null, user);

    });

  }));

}; // closes module.exports


