var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    'title': String,
    'employer': String,
    'skills_learned': [
      {type: Schema.ObjectId, ref: 'Skill'}
    ],
    'knowledge_used_or_gained': [
      {type: Schema.ObjectId, ref: 'Knowledge'}
    ]
  }
);

module.exports = schema;