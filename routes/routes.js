var fs = require('fs')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , User = require('../models/user').User
  , Drops = require('../models/user').Drops;

// middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

var scripts = [ 'javascripts/jquery.min.js',
                'javascripts/jquery.ui.widget.js',
                'bootstrap/js/bootstrap.js',
                'javascripts/modules/duedrop.js'
              ];

module.exports = function(app) {
  app.get('/', function(req, res) {
    if (req.user == null) {
      res.render('index', { title: 'duedrop', user: req.user, message: req.flash('error'), scripts: scripts });
    }
    else {
      res.render('index', { title: 'duedrop', user: req.user, drops: req.user.drops.reverse(), message: req.flash('error'), scripts: scripts });
    }
  });

  app.get('/signup', function(req, res) {
    res.render('signup', { title: 'duedrop - sign up', user: req.user, scripts: scripts });
  });

  app.post('/signup', function(req, res) {
    User.register(new User({ username: req.body.username, email: req.body.username }), 
                      req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.render('signup', { title: 'duedrop - sign up', user: user, scripts: scripts });
      }

      // Convenience method provided by Passport to auto-log in
      req.login(user, function(err) {
        if (err) {
          return res.render('signup', { title: 'duedrop - sign up', user: user, scripts: scripts });
        }
        res.redirect('/');
      });
    });
  });

  app.get('/user', ensureAuthenticated, function(req, res) {
    res.render('user', { title: 'duedrop - your account', user: req.user, scripts: scripts });
  });

  app.get('/login', function(req, res) {
    res.render('login', { title: 'duedrop - log in', user: req.user, message: req.flash('error'), scripts: scripts });
  });

  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: "Invalid username or password." }),
    function(req, res) {
      res.redirect('/');
    }
  );

  app.post('/drop', ensureAuthenticated, function(req, res) {
    var drop = new Drops(req.body.duedrop);
    
    User.findById(req.user._id, function(err, user) {
      if (err) {
        console.log(err);
        return req.flash('error', "There was an error retrieving your info: " + err);
      }

      user.drops.push(drop);
      user.save(function(err) {
        if (err) {
          console.log(err);
          return req.flash('error', "There was an error updating your dues: " + err);
        }
        res.json(200, drop);
      });
    });
  });

  app.post('/drop/update', ensureAuthenticated, function(req, res) {
    User.findById(req.user._id, function(err, user) {
      if (err) {
        console.log(err);
        return req.flash('error', "There was an error retrieving your info: " + err);
      }
      var updateDrop = user.drops.id(req.body.dropId);
      updateDrop.text = req.body.drop;
      user.save(function(err) {
        if (err) {
          console.log(err);
          return req.flash('error', "There was an error updating your dues: " + err);
        }
        res.json(200, updateDrop);
      });
    });
  });

  app.post('/drop/remove', ensureAuthenticated, function(req, res) {
    User.findById(req.user._id, function(err, user) {
      if (err) {
        console.log(err);
        return req.flash('error', "There was an error retrieving your info: " + err);
      }

      var dropToRemove = user.drops.id(req.body.dropId).remove();
      user.save(function(err) {
        if (err) {
          console.log(err);
          return req.flash('error', "There was an error updating your dues: " + err);
        }
        res.send(200);
      });
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}