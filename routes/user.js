var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');
router.get('/login', (req, res) => {
    if(req.user) return res.redirect('/');
    res.render('account/login', {message: req.flash('loginMessage')});
});
                                        // local-login is middleWare
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true //  so that get request can recieve failure flash
}));

router.get('/profile',(req, res, next) => {
  User.findOne({_id: req.user._id}, (err, user) => {
    if(err) return next(err);
    res.render('account/profile', {user: user});
  });


});

router.get('/signup', (req, res, next) => {
  res.render('account/signup', {
    errors: req.flash('errors')
  });
});

// Create User
router.post('/signup', (req, res, next) => {
  var user = new User();
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

  User.findOne({email: req.body.email}, (err, existingUser) => {
    if(existingUser){
      req.flash('errors','Account with that email already exist');
      return res.redirect('/signup');
    }else{
      user.save((err, user) => {
        if(err) return next(err);

        return res.redirect('/');
      });
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
