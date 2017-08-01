var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Portfolio;
router.use(function(req, res, next) {
  Portfolio = req.app.get('Portfolio');
  next();
});

router.get('/:portfolio_id', function(req, res, next) {
  Portfolio.findById(req.params.portfolio_id, function(err, portfolio) {
    if (!portfolio) {
      err = new Error("no such portfolio");
      err.status = 404;
    }
    if (err) {
      return next(err);
    }
    return res.json(portfolio);
  });
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
router.put('/', function(req, res, next) {
  req.user.portfolio[req.body.name] = req.body.value;
  return savePortfolio(req.user.portfolio, true, res, next);
});

router.post('/experiences', function(req, res, next) {
  var experiences = req.user.portfolio.experiences;
  var newexp = req.body;
  experiences.push(newexp);
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(portfolio.experiences.pop());
  });
});

router.param('exp_id', function(req, res, next, exp_id) {
  req.exp = req.user.portfolio.experiences.id(exp_id);
  if (!req.exp) {
    var err = new Error("no such experience");
    err.status = 404;
    return next(err);
  }
  next();
});

router.put('/experiences/:exp_id', function(req, res, next) {
  req.exp.name = req.body.name;
  req.exp.tags = req.body.tags;
  return savePortfolio(req.user.portfolio, true, res, next).then(function(portfolio) {
    res.json(req.exp);
  });
});

router.delete('/experiences/:exp_id', function(req, res, next) {
  req.exp.remove();
  return savePortfolio(req.user.portfolio, false, res, next).then(function() {
    res.sendStatus(200);
  });
});

module.exports = router;
