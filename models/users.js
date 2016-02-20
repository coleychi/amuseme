// REQUIREMENTS
// -----------------------------------------------------------------
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var promptSchema = require("./prompts.js").promptSchema;



// LOGIC
// -----------------------------------------------------------------
// create user schema
var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  prompts: [promptSchema]
});

// METHODS
// generate hash from password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password); 
};



// EXPORT
// -----------------------------------------------------------------
module.exports = mongoose.model("User", userSchema);