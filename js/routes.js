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
  const exp = portfolio.addExperience(req.body);
  portfolio.save().then((portfolio) => {
    return res.json(exp);
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

router.get('/experiences/:exp_ix', (req, res, next) => {
	return res.json(req.exp);
});

router.put('/experiences/:exp_ix', (req, res, next) => {
	const index = portfolio.experiences.indexOf(req.exp);
  portfolio.updateExperience(index, req.body);
  return portfolio.save().then(() => {
    return res.json(portfolio.experiences[index]);
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
  const theme = portfolio.addTheme(req.body);
  return portfolio.save().then((portfolio) => {
    return res.json(theme);
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

router.post('/campaign', (req, res, next) => {
	const options = req.body;
	try {
  	if (options) {
  		let path = 'campaign.json';
  		if (options.path) {
  			path = options.path;
  		}
  		let theme = '';
  		if (options.theme) {
  			theme = options.theme;
  		}
  		return portfolio.writeCampaignFile(path, theme).then(() => {
    		return res.sendStatus(200);
  		});
  	} else {
      const err = new Error("no options specified");
      err.status = 400;
      throw err;
  	}
	} catch (err) {
  	return next(err);
  }
});

module.exports = router;
