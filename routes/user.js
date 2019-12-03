var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
var userController = require("../controllers/userController");
const passport = require("passport");

router.post("/register", userController.register);

module.exports = router;
