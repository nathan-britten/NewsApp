const express = require("express");
const router = express.Router();
const passport = require("passport");
const PopularSearch = require("../models/popularSearch")
const User = require("../models/user")


//=========================
//Home Page
//==========================
router.get("/",function(req, res){
  let todaysDate = new Date;
  let date = todaysDate.getDate()
  let month = todaysDate.getMonth();
  let year = todaysDate.getFullYear();

  month += 1

  if(month < 10){
    month = "0" + month
    // month = Number(month)
  }
  if(date < 10){
    date = "0" + date
    // month = Number(month)
  }

  const filterDate = {
    date: date,
    month: month,
    year: year
  }

  let articleTitleArray = [];

  let amountOfArticles;

  if(req.user !== undefined){

    User.findOne({"username": req.user.username}, function(err, user){
      if(err){
        console.log(err)
      } else {
        // console.log(user.readLater)


        if(user.readLater !== undefined){


          amountOfArticles = user.readLater.length
          console.log(amountOfArticles)
          allArticles = user.readLater
         for(let i=0; i<allArticles.length; i++){
     
           articleTitleArray.push(user.readLater[i].title)
         }
       } else {
        amountOfArticles = 0;
        allArticles = [];
   
       }

      }
    })
    
  }

  PopularSearch.find({}, function(err, popularSearches){

    if(err){
      console.log(err)
    } else {

      if(req.user !== undefined){

        res.render("index", {
          filterDate: filterDate,
          popularSearches: popularSearches,
          amountOfArticles: amountOfArticles,
          articleTitleArray: articleTitleArray,
          active: req.user.username
        })
      } else {

        res.render("index", {
          filterDate: filterDate,
          popularSearches: popularSearches,
          amountOfArticles: amountOfArticles,
          articleTitleArray: articleTitleArray,
          active: "nobody"
        })


      }
      



    }


  })





})

router.post("/new", isLoggedIn, function(req, res){
 
  console.log(req.body)

  



  PopularSearch.deleteMany({}, function(err){
    console.log("Popular collection remoed.....")
  })

  PopularSearch.create({
    popularSearch: req.body.searchValue

  }, function(err, addedPopularSearch){
    if(err){
      console.log(err)
    } else {
  console.log("res") 
   }
  })

})







  //------------------------------
  // Authetication routes
  //------------------------------

  //register
  router.get("/register", function(req,res){
    res.render("register")
  })

  router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
      if(err){
        console.log(err)
        req.flash("error", "User already exists")
        res.redirect("/register")
       
      } else{
        passport.authenticate("local")(req, res, function(){
          res.redirect("/mynews")
        })
      }
    })
  })

  //login
  router.get("/login", function(req, res){
    
    res.render("login")
  })

  // passport.authenticate("local", {
  //   successRedirect: "/mynews",
  //   failureRedirect: "/login"

  // })

  router.post("/login", passport.authenticate("local", {
 
    failureRedirect: "/login",
    failureFlash : true
    }), function(req, res){

    let forwardUrl = req.body.url;

    let replaced =  forwardUrl.replace(/^.+#/,'')
  
    let name = req.user.username
    if(replaced === "mynews"){
      req.flash("success", `Welcome ${name}`)
      res.redirect("/mynews")
    } else  if(replaced === "readlater"){
      req.flash("success", `Welcome ${name}`)

      res.redirect("/readlater")
    } else if(replaced === "popular"){
      req.flash("success", `Welcome ${name}`)

      res.redirect("/mynews")

    } else{
      req.flash("success", `Welcome ${name}`)

      res.redirect("/mynews")
      
    }
    
  })
  ;

  //logout

  router.get("/logout", function(req, res){

    req.logout();
    req.flash("success", "You were logged out")
    res.redirect("/")
  
  })

  // router.get("*", function(req, res){
  //   res.redirect("/")

  // })

  
  function isLoggedIn(req, res, next){

    if(req.isAuthenticated()){
  
      return next();
  
    } 
    req.flash("error", "Please login first");
    res.redirect("/login")
  
  }


module.exports = router;