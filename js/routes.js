'use strict';

const express = require('express');
const router = express.Router();

let portfolio;
router.use((req, res, next) => {
   portfolio = req.app.get('portfolio');
   next();
});

router.get('/', (req, res, next) => {
  return res.json(portfolio.obj);
});

/*
router.put('/', (req, res, next) => {
  portfolio = req.body.value;
  return portfolio.save().then(() => {
    return res.sendStatus(200);
  });
});
*/

router.post('/experiences', (req, res, next) => {
  portfolio.addExperience(req.body);
  portfolio.save().then((portfolio) => {
    return res.json(portfolio.lastExperience);
  });
});

router.param('exp_ix', (req, res, next, exp_ix) => {
  req.exp = portfolio.experiences[exp_ix];
  if (!req.exp) {
    const err = new Error("no such experience");
    err.status = 404;
    return next(err);
  }
  next();
});

router.put('/experiences/:exp_ix', (req, res, next) => {
	const index = portfolio.experiences.indexOf(req.exp);
	console.log("updating exp: ", req.body);
  portfolio.experiences[index] = req.body;
  return portfolio.save().then(() => {
    return res.json(req.body);
  });
});

router.delete('/experiences/:exp_ix', (req, res, next) => {
	const index = portfolio.experiences.indexOf(req.exp);
  portfolio.deleteExperience(index);
  return portfolio.save().then(() => {
    return res.sendStatus(200);
  });
});

router.post('/themes', (req, res, next) => {
  portfolio.addTheme(req.body);
  return portfolio.save().then((portfolio) => {
    return res.json(portfolio.lastTheme);
  });
});

router.param('theme_ix', (req, res, next, theme_ix) => {
  req.theme = portfolio.themes[theme_ix];
  if (!req.theme) {
    const err = new Error("no such theme");
    err.status = 404;
    return next(err);
  }
  next();
});

router.get('/themes/:theme_ix', (req, res, next) => {
	return res.json(req.theme);
});

router.delete('/themes/:theme_ix', (req, res, next) => {
	const index = portfolio.themes.indexOf(req.theme);
  portfolio.deleteTheme(index);
  return portfolio.save().then(() => {
    return res.sendStatus(200);
  });
});

module.exports = router;
