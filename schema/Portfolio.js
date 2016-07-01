var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    'skills': [
      {type: Schema.ObjectId, ref: 'Skill'}
    ],
    'knowledge': [
      {type: Schema.ObjectId, ref: 'Knowledge'}
    ]
    'jobs': [
      {type: Schema.ObjectId, ref: 'Job'}
    ]
  }
);

module.exports = schema;