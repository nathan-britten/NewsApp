const express       = require("express"),
      mongoose      = require("mongoose"),
      bodyParser    = require("body-parser"),
      cors = require("cors"),
    
      Preference = require("./models/preference"),
      PopularSearch = require("./models/popularSearch"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      url = require("url"),
      flash = require("connect-flash")

const indexRoutes = require("./routes/index"),
      myNewsRoutes = require("./routes/mynews"),
      readlaterRoutes = require("./routes/readlater")

  const NewsAPI = require('newsapi');
  const newsapi = new NewsAPI('67f9d041fb49469e8993de4d5414b40c');
  const app = express();

  const db = "mongodb://localhost:27017/newsApp";
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology:true })
  app.use(flash());

//=================
//Passport config
//=================
app.use(require("express-session")({
  secret:"Listen to what you hear",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
  res.locals.activeUser = req.user;
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next();
})

app.use(express.static( __dirname + "/public"));
// app.use(express.static( __dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use(indexRoutes);
app.use(myNewsRoutes);
app.use(readlaterRoutes);

app.listen(3000, function(req, res){
  console.log("Server online....")
})