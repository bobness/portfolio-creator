var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Theme = new Schema({
  'name': String,
  'tags': [
    String
  ] 
});

var Experience = new Schema({
  'Company Name': String,
  'Description': String,
  'Location': String,
  'Start Date': String,
  'End Date': String,
  'Title': String,
  'tags': [
    String
  ]
});

var Portfolio = new Schema({
  'experiences': [
    //{type: Schema.ObjectId, ref: 'Job'}
    Experience
  ],
  'themes': [
    Theme
  ]
});

module.exports = Portfolio;