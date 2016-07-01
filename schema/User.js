var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    'github': String,
    'name': String,
    'email': String,
    'portfolio': {type: Schema.ObjectId, ref: 'Portfolio'}
  }
);

module.exports = schema;