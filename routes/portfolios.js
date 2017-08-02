var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Portfolio;
router.use(function(req, res, next) {
  Portfolio = req.app.get('Portfolio');
  next();
});

router.param('portfolio_id', function(req, res, next, exp_id) {
  Portfolio.findById(req.params.portfolio_id, function(err, portfolio) {
    if (!portfolio) {
      err = new Error("no such portfolio");
      err.status = 404;
    }
    if (err) {
      return next(err);
    }
    req.portfolio = portfolio;
    return next();
  });
});

router.get('/:portfolio_id', function(req, res, next) {
  return res.json(req.portfolio);
});

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
router.put('/:portfolio_id', function(req, res, next) {
  req.portfolio[req.body.name] = req.body.value;
  return savePortfolio(req.portfolio, true, res, next);
});

router.post('/:portfolio_id/experiences', function(req, res, next) {
  var experiences = req.portfolio.experiences;
  var newexp = req.body;
  experiences.push(newexp);
  return savePortfolio(req.portfolio, true, res, next).then(function(portfolio) {
    return res.json(portfolio.experiences.pop());
  });
});

router.param('exp_id', function(req, res, next, exp_id) {
  req.exp = req.portfolio.experiences.id(exp_id);
  if (!req.exp) {
    var err = new Error("no such experience");
    err.status = 404;
    return next(err);
  }
  next();
});

router.put('/:portfolio_id/experiences/:exp_id', function(req, res, next) {
  req.exp.tags = [];
  req.body.tags.forEach(function(tag) {
    req.exp.tags.push(tag);
  });
  return savePortfolio(req.portfolio, true, res, next).then(function(portfolio) {
    return res.json(req.exp);
  });
});

router.delete('/:portfolio_id/experiences/:exp_id', function(req, res, next) {
  req.exp.remove();
  return savePortfolio(req.portfolio, false, res, next).then(function() {
    return res.sendStatus(200);
  });
});

module.exports = router;
