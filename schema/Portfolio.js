var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Skill = new Schema({
    'name': String
  }
);

var Knowledge = new Schema({
    'name': String
  }
);

var Job = new Schema({
    'name': String,
    'skills_learned': [
      String
    ],
    'knowledge_gained': [
      String
    ]
  }
);

var Portfolio = new Schema({
    'skills': [
      //{type: Schema.ObjectId, ref: 'Skill'}
      Skill
    ],
    'knowledge': [
      //{type: Schema.ObjectId, ref: 'Knowledge'}
      Knowledge
    ],
    'jobs': [
      //{type: Schema.ObjectId, ref: 'Job'}
      Job
    ]
  }
);

module.exports = Portfolio;