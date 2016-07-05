var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var User;
router.use(function(req, res, next) {
  User = req.app.get('User');
  next();
});

router.get('/:user_id', function(req, res, next) {
  User.findById(req.params.user_id)
    .populate('portfolio')
    .exec(function(err, user) {
      if (!user) {
        err = new Error("no such user");
        err.status = 404;
      }
      if (err) {
        next(err);
      }
      return res.json(user);
    })
});

router.param('user_id', function(req, res, next, user_id) {
  User.findOne({_id: ObjectId(user_id)})
    .populate('portfolio')
    .exec(function(err, user) {
/*
    if (err) {
      return next(err);
    }
*/
    req.user = user;
    //console.log("got user - ", user);
    return next(err);
  });
});

router.put('/:user_id', function(req, res, next) {
  req.user[req.body.name] = req.body.value;
  return user.save(function(err) {
    if (err) {
      next(err);
    } else {
      return res.json(user);
    }
  });
});

router.use('/:user_id/portfolio', require('./portfolios'));

module.exports = router;
