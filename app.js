var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
const passport = require("passport");
const flash = require("connect-flash");
var session = require("express-session");

var learnerRouter = require("./routes/learner");
var tutorRouter = require("./routes/tutor");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var userRouter = require("./routes/user");

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET/PUT/POST/DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Passport Config
require("./controllers/passport")(passport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// Connect flash
app.use(flash());

// error handler
app.use(function(req, res, next) {
  // set locals, only providing error in development
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use("/learner", learnerRouter);
app.use("/tutor", tutorRouter);

app.use("/users", usersRouter);
app.use("/user", userRouter);
app.use("/", passport.authenticate("jwt", { session: false }), indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
