// REQUIREMENTS
// -----------------------------------------------------------------
var mongoose = require("mongoose");
// var responses = require("./responses.js");



// LOGIC
// -----------------------------------------------------------------
// create prompt schema
var promptSchema = new mongoose.Schema({
  promptBody: {type: String, required: true},
  timestamp: {type: Date, default: Date.now}
  // responses: [responsesSchema]
});



// EXPORT
// -----------------------------------------------------------------
module.exports = mongoose.model("Prompt", promptSchema);
module.exports.promptSchema = promptSchema