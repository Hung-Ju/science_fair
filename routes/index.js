var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '科展系統' , member_id:req.session.member_id, member_name:req.session.member_name});
});

module.exports = router;
