// REQUIREMENTS
// -----------------------------------------------------------------
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");



// LOGIC
// -----------------------------------------------------------------
// create user schema
var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
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