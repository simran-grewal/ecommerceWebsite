var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var User = require('./models/user');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var session = require('express-session');

mongoose.connect('mongodb://amazon:abcd@ds111771.mlab.com:11771/ecommerce', (err) => {
  if(err){
    console.log(err);
  }
  else {
    console.log('Connected To database');
  }
})
var port = process.env.PORT || 3000; // set our port


// middleWare
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave: true, // save back to session Storage
  saveUninitialized: true,
  secret: "Simran@#$%"
}));
app.use(flash());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);

app.listen(port, (err) => {
  if(err) throw err;
  console.log('Server is Running on 3000');
})
