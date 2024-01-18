var express = require('express');
var router = express.Router();
const postmodel=require('./posts');
const userModel=require('./users');  //to use mongodb models
const passport = require('passport');
const localStrategy=require('passport-local');
const upload=require('./multer')

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index',{nav:false,error:req.flash('error')}); //making nav=false to hide navbar and show it only in profile page && here we also pass error
});

router.get('/register',function(req,res,next){
  res.render('register',{nav:false});         //this shows register when user clicks not have account
})

router.get('/profile',isloggedin, async function(req, res, next) {  //to make this protected we added isloggedin function
  const user=       //checking which user is logged in
  await userModel
    .findOne({username:req.session.passport.user}) 
    .populate("posts")
  res.render('profile',{user,nav:true}); //to show nav
});

router.get('/show/posts',isloggedin, async function(req, res, next) {  
  const user=       
  await userModel
    .findOne({username:req.session.passport.user}) 
    .populate("posts")
  res.render('show',{user,nav:true}); 
});

router.get('/feed',isloggedin, async function(req, res, next) {  
  const user=await userModel.findOne({username:req.session.passport.user})  //this gives logged in user
  const posts=await postmodel.find()
   .populate("user")
  res.render("feed",{user,posts,nav:true});
});


router.get('/add',isloggedin, async function(req, res, next) {  //to make this protected we added isloggedin function
  const user=await userModel.findOne({username:req.session.passport.user})      //checking which user is logged in
  res.render('add',{user,nav:true}); //to show nav
});

router.post('/createpost',isloggedin,upload.single("postimage"), async function(req, res, next) {  
  const user=await userModel.findOne({username:req.session.passport.user})      
 const post=await postmodel.create({
    user:user._id, //creating post under logged in user
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  })
  user.posts.push(post._id);  //says user that he created post
  await user.save();
  res.redirect("/profile");
});


router.post('/fileupload',isloggedin, upload.single("image"),async function(req, res, next) {  //upload.single("here name should be same as in form's input's name ")
 const user=await userModel.findOne({username:req.session.passport.user})  //whenever we login req.session.p.u have our name   //linking photos to user database
  user.profileImage=req.file.filename;  //this makes image to be saved in user logged in profile
  await user.save();
  res.redirect("/profile");
});

router.post('/login',passport.authenticate("local",{
  failureRedirect:"/",      //takes to "/" route if fails
  successRedirect:"/profile",
  failureFlash:true  // to show error by flash  this creates error this takes to "/" route bcz it is failed
}),function(req,res,next){     
})

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


router.post('/register',function(req,res,next){     //this is when user submits form
  const data=userModel({    // here write all which are being submitted by register page
    username:req.body.username,   //first parameter is from users.js and :second one req.body.smtg is from register form's named values given input tags
    email:req.body.email,
    contact:req.body.contact,
    name:req.body.fullname
  })
  userModel.register(data,req.body.password) //promise
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

function isloggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


module.exports = router;
