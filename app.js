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
    // timeout = require('connect-timeout'); //express v4


const indexRoutes = require("./routes/index"),
      myNewsRoutes = require("./routes/mynews"),
      readlaterRoutes = require("./routes/readlater")

  const NewsAPI = require('newsapi');
  const newsapi = new NewsAPI('67f9d041fb49469e8993de4d5414b40c');
  const app = express();

  // const db = "mongodb://localhost:27017/newsApp";
  // const db1 = "mongodb+srv://admin:<password>@newsapp-876dg.mongodb.net/test?retryWrites=true&w=majority";
  // mongoose.connect("mongodb://localhost:27017/newsApp", { useNewUrlParser: true, useUnifiedTopology:true })

  // app.use(timeout(10000));
  // app.use(haltOnTimedout);
  
  // function haltOnTimedout(req, res, next){
  //   if (!req.timedout) next();
  // }


  mongoose.connect("mongodb+srv://admin:Manchester1!@newsapp-876dg.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology:true })


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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});