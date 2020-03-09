const express = require("express");
const router = express.Router();
const passport = require("passport")
const User = require("../models/user")
// var timeout = express.timeout // express v3 and below



//======================
//Read Later 
//======================

router.get("/readLater",isLoggedIn ,function(req, res){
  let articleTitleArray = [];
  User.findOne({"username": req.user.username}, function(err, user){
    if(err){
      console.log(err)
    } else {


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





      // console.log(user.readLater)

      res.render("readlater", {
              articles: allArticles,
              amountOfArticles: amountOfArticles
            })


    }
  })

  // ReadLater1.find({}, function(err, allArticles){
  //   if(err){
  //     console.log(err)
  //   } else {

  //     res.render("readlater", {
  //       articles: allArticles
  //     })
  //   }
  // })

})

router.post("/readlater" ,function(req, res){


  User.findOne({"username": req.user.username}, function(err, user){
    if(err){
      console.log(err)
    } else {

      let article = {
        image: req.body.image,
        title: req.body.title,
        date: req.body.date,
        info: req.body.info,
        url: req.body.url
      }
      let exists;

      for(let i = 0; i < user.readLater.length; i++){

        if(user.readLater[i].title === req.body.title){
        exists = true;
        } else {
          exists = false;

        }
      }
      console.log(exists)

      if(exists === true){


      } else {
        user.readLater.push(article)
        user.save(function(err, user){
          if(err){
            console.log(err)
            console.log()
          } else {
            console.log("RL Added...")
            // console.log(user)
            res.send("thanks")

          }
        })

      }
    }
  })

})

// router.get("/readlater/:id",isLoggedIn, function(req, res){
//   res.send("Page for article")
// })


router.delete("/readlater/:id",isLoggedIn ,function(req,res){

  User.findOne({"username": req.user.username}, function(err, user){
    if(err){
      console.log(err)
    } else {

      for(let i=0; i < user.readLater.length; i++){

        if(user.readLater[i].id === req.params.id){
          // console.log(user.readLater[i])

          user.readLater.splice(i,1)
          user.save(function(err, user){
            if(err){
              console.log(err)
            } else{
              console.log("RL DELEted....")
              res.send("thanks")
            }
          })
        }

        

      }



    }
  })




  // ReadLater.findByIdAndDelete(req.params.id, function(err, deletedPost){
  //   if(err){
  //     console.log(err)
  //     res.redirect("/readlater")
  //   } else {

  //   }
  // })
  // console.log(req.params.id)
})

function isLoggedIn(req, res, next){

  if(req.isAuthenticated()){

    return next();

  } 
  req.flash("error", "Please login first");
  res.redirect("/login")

}

module.exports = router;