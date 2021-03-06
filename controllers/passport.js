const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require("../models/users");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      userModel.findUserByTypeEmail('normal', email)
        .then(user => {
          if (!user) {
            return done(null, false, { message: "Tài khoản không tồn tại!" });
          }

          if (user.isblocked) {
            return done(null, false, { message: "Tài khoản đã bị khóa!" });
          }

          if (!user.isActivated) {
            return done(null, false, { message: "Tài khoản chưa kích hoạt! Vui lòng kiểm tra email!" });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Sai thông tin đăng nhập!" });
            }
          });
        });
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your_jwt_secret"
      },
      function (jwtPayload, cb) {
        return userModel.findUserById(jwtPayload._id)
          .then(user => {
            return cb(null, user);
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
    userModel.findUserById(jwtPayload._id).then((err, user) => {
      done(null, user);
    });
  });
};
