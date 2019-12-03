const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const learnerModel = require("../models/learners");
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, type, done) => {
      // Match user
      console.log(email);

      if (type === 'learner') {
        learnerModel.findLearnerByEmailType(email, 'normal')
          .then(learner => {
            if (!learner) {
              return done(null, false, { message: "Tài khoản không tồn tại!" });
            }

            // Match password
            bcrypt.compare(password, learner.password, (err, isMatch) => {
              if (err) {
                throw err;
              }
              if (isMatch) {
                return done(null, learner);
              } else {
                return done(null, false, { message: "Sai thông tin đăng nhập!" });
              }
            });
          });
      }
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your_jwt_secret"
      },
      function (jwtPayload, cb) {
        return learnerModel.findLearnerById(jwtPayload._id)
          .then(learner => {
            return cb(null, learner);
          })
          .catch(err => {
            return cb(err);
          });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    learnerModel.findLearnerById(jwtPayload._id).then((err, learner) => {
      done(null, learner);
    });
  });
};
