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

router.put('/skills', function(req, res, next) {
  var skill = req.user.portfolio.skills.id(req.body.pk);
  if (!skill) {
    var err = new Error("no such skill");
    err.status = 404;
    return next(err);
  }
  skill.name = req.body.value;
  return savePortfolio(req.user.portfolio, skill, res, next);
});

module.exports = router;
