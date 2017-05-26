var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Job = new Schema({
    'Company Name': String,
    'Description': String,
    'Location': String,
    'Start Date': String,
    'End Date': String,
    'Title': String,
    'experience': [
      String
    ]
});

var Portfolio = new Schema({
    'jobs': [
      //{type: Schema.ObjectId, ref: 'Job'}
      Job
    ]
});

module.exports = Portfolio;