var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '科展系統' , username:req.session.user, uid:req.session.userid});
});

module.exports = router;
