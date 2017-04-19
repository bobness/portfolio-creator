var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    'name': String,
    'employer': String,
    'skills_learned': [
      String
    ],
    'knowledge_gained': [
      String
    ]
  }
);

module.exports = schema;