var express = require("express");
var router = express.Router();
var tutorController = require("../controllers/tutorControllers");

router.post("/register&type=:type", tutorController.registerPost);

module.exports = router;
