var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Science Fair科學探究專題系統' , member_id:req.session.member_id, member_name:req.session.member_name});
});

module.exports = router;
