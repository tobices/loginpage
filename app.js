var express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  pasppLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify, false");
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("mongodb://localhost:27017");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  require("express-session")({
    secret: "rusty is a dog",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authentication()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes set up
//home page
app.get("/", function (req, res) {
  res.render("home");
});

//Showing session secret page
app.get("/secret", isLoggedIn, function (Req, res) {
  res.render("secret");
});

//Register Form
app.get("/register", function (req, res) {
  res.render("register");
});

//sign up Page
app.post("/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.register(
    new User({ username: username }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function () {
        res.render("secret");
      });
    }
  );
});

//Showing login form

app.get("/login", function (req, res) {
  res.render("login");
});

// login form running work
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
//logout
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("connected to mongodb");
});
