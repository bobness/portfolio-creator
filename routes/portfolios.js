var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Portfolio;
router.use(function(req, res, next) {
  Portfolio = req.app.get('Portfolio');
  next();
});

// TODO: public access of a portfolio
/*
router.get('/:portfolio_id', function(req, res, next) {
  Portfolio.findById(req.params.user_id)
    //.populate('skills')
    .exec(function(err, portfolio) {
      if (!portfolio) {
        err = new Error("no such portfolio");
        err.status = 404;
      }
      if (err) {
        next(err);
      }
      return res.json(portfolio);
    })
});
*/

function savePortfolio(portfolio, returnObj, res, next) {
  return portfolio.save(function(err, obj) {
    if (err) {
      return next(err);
    } else {
      return returnObj ? obj : '';
    }
  });
}

// user changing their portfolio
router.put('/', function(req, res, next) {
  req.user.portfolio[req.body.name] = req.body.value;
  return savePortfolio(req.user.portfolio, true, res, next);
});

/*
router.post('/skills', function(req, res, next) {
  var skills = req.user.portfolio.skills;
  var newskill = req.body;
  skills.push(newskill);
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(portfolio.skills.pop());
  });
});

router.param('skill_id', function(req, res, next, skill_id) {
  req.skill = req.user.portfolio.skills.id(skill_id);
  if (!req.skill) {
    var err = new Error("no such skill");
    err.status = 404;
    return next(err);
  }
  next();
});

router.put('/skills/:skill_id', function(req, res, next) {
  req.skill.name = req.body.name;
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(req.skill);
  });
});

router.delete('/skills/:skill_id', function(req, res, next) {
  req.skill.remove();
  return savePortfolio(req.user.portfolio, false, res, next).then(function() {
    res.sendStatus(200);
  });
});

router.post('/knowledge', function(req, res, next) {
  var knowledge = req.user.portfolio.knowledge;
  var newknowledge = req.body;
  knowledge.push(newknowledge);
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(portfolio.knowledge.pop());
  });
});

router.param('knowledge_id', function(req, res, next, knowledge_id) {
  req.knowledge = req.user.portfolio.knowledge.id(knowledge_id);
  if (!req.knowledge) {
    var err = new Error("no such piece of knowledge");
    err.status = 404;
    return next(err);
  }
  next();
});

router.put('/knowledge/:knowledge_id', function(req, res, next) {
  req.knowledge.name = req.body.name;
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(req.knowledge);
  });
});

router.delete('/knowledge/:knowledge_id', function(req, res, next) {
  req.knowledge.remove();
  return savePortfolio(req.user.portfolio, false, res, next).then(function() {
    res.sendStatus(200);
  });
});
*/

router.post('/jobs', function(req, res, next) {
  var jobs = req.user.portfolio.jobs;
  var newjob = req.body;
  jobs.push(newjob);
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(portfolio.jobs.pop());
  });
});

router.param('job_id', function(req, res, next, job_id) {
  req.job = req.user.portfolio.jobs.id(job_id);
  if (!req.job) {
    var err = new Error("no such job");
    err.status = 404;
    return next(err);
  }
  next();
});

router.put('/jobs/:job_id', function(req, res, next) {
  req.job.name = req.body.name;
  req.job.skills_learned = req.body.skills_learned;
  req.job.knowledge_gained = req.body.knowledge_gained;
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(req.job);
  });
});

router.delete('/jobs/:job_id', function(req, res, next) {
  req.job.remove();
  return savePortfolio(req.user.portfolio, false, res, next).then(function() {
    res.sendStatus(200);
  });
});

module.exports = router;
