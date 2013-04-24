var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose');

var Drops = new Schema({ 
  'text': String,
  'completed': { type: Boolean, default: false },
  'created_on': { type: Date, default: new Date() },
  'due_date': { type: Date, default: null },
  'completed_on': Date,
  'subdrops': [Drops]
});

var User = new Schema({
  'username': { type: String, index: { unique: true }, required: true },
  'email': { type: String, index: { unique: true }, required: true },
  'member_since': { type: Date, default: new Date() },
  'drops': [Drops]
});

User.plugin(passportLocalMongoose);

module.exports = { User: mongoose.model('User', User), Drops: mongoose.model('Drops', Drops) };