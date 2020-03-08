const express = require("express");
const router = express.Router();
const passport = require("passport")
const User = require("../models/user")


//====================================
//My news
//====================================

router.get("/mynews",isLoggedIn,function(req,res){
  let articleTitleArray = [];

  User.findOne({"username": req.user.username}, function(err, user){
    if(err){
      console.log(err)
    } else {
      // console.log(user)
    //  user.preferences.push("now")
    let amountOfArticles;
    let allArticles;
    const preferences = user.preferences[0]
    // console.log(preferences)
    // user.preferences.push(req.body)
    if(user.readLater !== undefined){


       amountOfArticles = user.readLater.length

       allArticles = user.readLater
      for(let i=0; i<allArticles.length; i++){
  
        articleTitleArray.push(user.readLater[i].title)
      }
    } else {
      amountOfArticles = 0;
      allArticles = [];

    }



      


    res.render("mynews", {
      preferences: preferences,
      amountOfArticles: amountOfArticles,
      articleTitleArray: articleTitleArray,
      active: req.user.username
    })
    }
  })

  // Preference.find({}, function(err, preferences){
    
  //   if(err) {
  //     console.log(err)
  //   } else {

  //     // res.render("mynews", {
  //     //   preferences: preferences[0].preference
  //     // })

  //   }
    
  // })

})

router.post("/mynews", isLoggedIn, function(req, res){
  console.log("hello" + req.user.username)

    // Preference.deleteMany({}, function(err){
    //   console.log("collection remoed.....")
    // })

    // Preference.create({
    //   preference: req.body
    // }, function(err, addedPreference){
    //   if(err){
    //     console.log(err)
    //   } else {
    // console.log("res") 
    // }
    // })

    User.findOne({"username": req.user.username}, function(err, user){
      if(err){
        console.log(err)
      } else {
      //  user.preferences.push("now")
      user.preferences = []
      user.preferences.push(req.body)
       user.save(function(err, user){
         if(err){
           console.log(err)
         } else{
          //  console.log(user)
         }
       })
      }
    })

 
    

  })

  function isLoggedIn(req, res, next){

    if(req.isAuthenticated()){
  
      return next();
  
    } 
    req.flash("error", "Please login first");
    res.redirect("/login")
  
  }

  module.exports = router;