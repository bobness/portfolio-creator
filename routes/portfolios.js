const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

let Portfolio;
router.use(function(req, res, next) {
  Portfolio = req.app.get('Portfolio');
  next();
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

router.post('/:portfolio_id/themes', function(req, res, next) {
  console.log('theme: ', req.body);
  var themes = req.portfolio.themes;
  themes.push(req.body);
  console.log('themes: ', themes);
  return savePortfolio(req.portfolio, true, res, next).then(function(portfolio) {
    console.log('themes2: ', portfolio.themes);
    return res.json(portfolio.themes.pop());
  });
});

router.param('theme_id', function(req, res, next, theme_id) {
  req.theme = req.portfolio.themes.id(theme_id);
  if (!req.theme) {
    var err = new Error("no such theme");
    err.status = 404;
    return next(err);
  }
  next();
});

router.delete('/:portfolio_id/themes/:theme_id', function(req, res, next) {
  req.theme.remove();
  return savePortfolio(req.portfolio, false, res, next).then(function() {
    return res.sendStatus(200);
  });
});

module.exports = router;
