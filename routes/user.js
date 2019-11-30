var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
var userController = require("../controllers/userController");
const passport = require("passport");

router.post("/register", userController.registerPost);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.json({
        status: 445,
        message: "failed"
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, "your_jwt_secret");

      const data = {
        name: user.name,
        email: user.email,
        picture: user.picture
      };
      return res.json({
        data,
        token
      });
    });
  })(req, res, next);
});

module.exports = router;
