var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");


router.get("/campgrounds",function(req,res){
  Campground.find({},function(err,allcampgrounds){
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/campgrounds",{campgrounds:allcampgrounds, currentUser:req.user});
    }
  });

});

//CREATE ROUTE-3
router.post("/campgrounds",isLoggedIn,function(req,res){
  var name = req.body.name;
  var image = req.body.image_url;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name:name , image: image,author:author}

  Campground.create(newCampground,function(err,newlyCreated){
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds");
    }
  });
});

//NEW ROUTE-2
router.get("/campgrounds/new",isLoggedIn,function(req,res){
  res.render("campgrounds/new");
});

//SHOW ROUTE-4
router.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,campgroundID){
    if (!err) {
      res.render("campgrounds/show",{campground: campgroundID});
    }
  });

});

// edit campground
router.get("/campgrounds/:id/edit",function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    if (err) {
      res.redirect("/campgrounds");
    }
    else {
      res.render("campgrounds/edit",{campground: foundCampground});
    }
  });

});

//update campground
router.put("/campgrounds/:id/edit",function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground , function(err,updatedCampground){
    if (err) {
      res.redirect("/campgrounds");
    }
    else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

router.delete("/campgrounds/:id",function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      res.redirect("/campgrounds");
    }
    else {
      res.redirect("/campgrounds");
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
