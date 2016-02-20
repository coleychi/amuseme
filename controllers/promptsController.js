// REQUIREMENTS
// -----------------------------------------------------------------
var express = require("express");
var router = express.Router();



// ROUTES
// -----------------------------------------------------------------
// INDEX
router.get("/", function(req, res) {
  res.render("prompts/index.ejs");
});





// EXPORT
// -----------------------------------------------------------------
module.exports = router;