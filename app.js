
// ejs ver 3.0.1

// Required
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var methodOverride = require("method-override")
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

//seedDB();
//dbCONN
mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp",{ useNewUrlParser: true,useUnifiedTopology: true }).then(
    ()=> console.log('connected to db')
).catch(
    (err)=> console.error(err)
);

// declarations

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(require("express-session")({
  secret:"Boom Baam",
  resave:false,
  saveUninitialized: false
}));
app.use(methodOverride("_method"));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//to provide currentUser info to all routes
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


// server listen
app.listen(3000,function(){
  console.log("Server Initiated!")
});
