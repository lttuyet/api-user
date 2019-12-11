var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");

router.get("/me", function(req, res, next) {
  return res.json({user});  
});

router.post("/updatebasic", userController.updateBasic);

module.exports = router;
