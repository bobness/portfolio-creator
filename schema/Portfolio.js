var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Theme = new Schema({
  'tags': [
    String
  ] 
});

var Job = new Schema({
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
  'jobs': [
    //{type: Schema.ObjectId, ref: 'Job'}
    Job
  ],
  'themes': [
    Theme
  ]
});

module.exports = Portfolio;