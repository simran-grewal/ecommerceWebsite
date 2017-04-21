var router = require('express').Router();
var User = require('../models/user');

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

module.exports = router;
