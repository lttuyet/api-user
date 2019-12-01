var express = require("express");
var router = express.Router();
var learnerController = require("../controllers/learnerControllers");

router.post("/register", learnerController.registerPost);

module.exports = router;
