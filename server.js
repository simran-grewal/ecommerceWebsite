var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var User = require('./models/user');
mongoose.connect('mongodb://amazon:abcd@ds111771.mlab.com:11771/ecommerce', (err) => {
  if(err){
    console.log(err);
  }
  else {
    console.log('Connected To database');
  }
})


// middleWare
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Create User
app.post('/create-user', (req, res, next) => {
  var user = new User();
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;
  user.save((err) => {
    if(err)  return next(err);
    res.json('Successfully Created new User');
  });
});


app.get('/', (req, res) => {
    res.render('home');
})
app.get('/about', (req, res) => {
  res.render('about');
})
app.listen(3000, (err) => {
  if(err) throw err;
  console.log('Server is Running on 3000');
})
