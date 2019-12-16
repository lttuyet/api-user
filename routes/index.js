var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");

router.post("/updatebasic", userController.updateBasic);

router.get("/me", userController.getDetails);

router.post("/updateimage", userController.updateImage);

module.exports = router;
