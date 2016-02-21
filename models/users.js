// REQUIREMENTS
// -----------------------------------------------------------------
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var promptSchema = require("./prompts.js").promptSchema;
var responseSchema = require("./responses.js").responseSchema;



// LOGIC
// -----------------------------------------------------------------
// create user schema
var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true, lowercase: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  about: {type: String},
  prompts: [promptSchema],
  responses: [responseSchema]
});


// userSchema.path('username').validate(function (username) {
//   return username.length > 5;
// }, "error"); // won't allow a username less than 5 characters

// METHODS
// generate hash from password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid (matches hash)
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password); 
};



// EXPORT
// -----------------------------------------------------------------
module.exports = mongoose.model("User", userSchema);