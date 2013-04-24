/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose');

var app = express();

// all environments
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser({
    keepExtensions: true
  }));
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'hermes pharmakon' }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function() {
  app.set('db-uri', 'mongodb://localhost/duedrop-development');
  app.use(express.errorHandler());
  app.set('view options', {
    pretty: true
  });
});

// test only
app.configure('test', function() {
  app.set('db-uri', 'mongodb://localhost/duedrop-test');
  app.set('view options', {
    pretty: true
  });  
});

// production only
app.configure('production', function() {
  app.set('db-uri', process.env.MONGOLAB_URI || 'mongodb://localhost/duedrop-production');
});

var User = require('./models/user').User;

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express API is wonky; use app.set('db-uri') to get db-uri
mongoose.connect(app.set('db-uri'));

require('./routes/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
