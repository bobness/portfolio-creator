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

function savePortfolio(portfolio, resultString, res, next) {
  return portfolio.save(function(err) {
    if (err) {
      return next(err);
    } else {
      return res.json(resultString);
    }
  });
}

// user changing their portfolio
router.put('/', function(req, res, next) {
  req.user.portfolio[req.body.name] = req.body.value;
  return savePortfolio(req.user.portfolio, portfolio, res, next);
});

router.post('/skills', function(req, res, next) {
  var skills = req.user.portfolio.skills;
  var newskill = {name: req.body.value};
  skills.push(newskill);
  return savePortfolio(req.user.portfolio, newskill, res, next);
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
  return savePortfolio(req.user.portfolio, req.skill, res, next);
});

router.delete('/skills/:skill_id', function(req, res, next) {
  req.skill.remove();
  return savePortfolio(req.user.portfolio, "", res, next);
});

router.post('/knowledge', function(req, res, next) {
  var knowledge = req.user.portfolio.knowledge;
  var newknowledge = {name: req.body.value};
  knowledge.push(newknowledge);
  return savePortfolio(req.user.portfolio, newknowledge, res, next);
});

router.put('/knowledge', function(req, res, next) {
  var knowledge = req.user.portfolio.knowledge.id(req.body.pk);
  if (!knowledge) {
    var err = new Error("no such knowledge");
    err.status = 404;
    return next(err);
  }
  knowledge.name = req.body.value;
  return savePortfolio(req.user.portfolio, knowledge, res, next);
});

router.delete('/knowledge', function(req, res, next) {
  var knowledge = req.user.portfolio.knowledge.id(req.body.pk);
  if (!knowledge) {
    var err = new Error("no such knowledge");
    err.status = 404;
    return next(err);
  }
  knowledge.remove();
  return savePortfolio(req.user.portfolio, "", res, next);
});

router.post('/jobs', function(req, res, next) {
  var jobs = req.user.portfolio.jobs;
  var newjob = {name: req.body.value};
  jobs.push(newjob);
  return savePortfolio(req.user.portfolio, newjob, res, next);
});

router.put('/jobs', function(req, res, next) {
  var job = req.user.portfolio.jobs.id(req.body.pk);
  if (!job) {
    var err = new Error("no such job");
    err.status = 404;
    return next(err);
  }
  job.name = req.body.value;
  return savePortfolio(req.user.portfolio, job, res, next);
});

router.delete('/jobs', function(req, res, next) {
  var job = req.user.portfolio.jobs.id(req.body.pk);
  if (!job) {
    var err = new Error("no such job");
    err.status = 404;
    return next(err);
  }
  job.remove();
  return savePortfolio(req.user.portfolio, "", res, next);
});

module.exports = router;
