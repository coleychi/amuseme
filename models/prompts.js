// REQUIREMENTS
// -----------------------------------------------------------------
var mongoose = require("mongoose");
var responseSchema = require("./responses.js").responseSchema;



// LOGIC
// -----------------------------------------------------------------
// create prompt schema
var promptSchema = new mongoose.Schema({
  promptBody: {type: String, required: true},
  timestamp: {type: Date, default: Date.now},
  responses: [responseSchema]
});



// EXPORT
// -----------------------------------------------------------------
module.exports = mongoose.model("Prompt", promptSchema);
module.exports.promptSchema = promptSchema