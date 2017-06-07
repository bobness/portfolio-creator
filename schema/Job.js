var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    'employer': String,
    'description': String,
    'location': String,
    'start': String,
    'end': String,
    'title': String,
    'experience': [
      String
    ]
  }
);

module.exports = schema;