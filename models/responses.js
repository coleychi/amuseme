// REQUIREMENTS
// -----------------------------------------------------------------
var mongoose = require("mongoose");



// LOGIC
// -----------------------------------------------------------------
// create prompt schema
var responseSchema = new mongoose.Schema({
  responseBody: {type: String, required: true},
  timestamp: {type: Date, default: Date.now}
});


// EXPORT
// -----------------------------------------------------------------
module.exports = mongoose.model("Response", responseSchema);
module.exports.responseSchema = responseSchema