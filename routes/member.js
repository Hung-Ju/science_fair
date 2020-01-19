var express = require('express');
var router = express.Router();
var member = require('../models/member');

/* GET users listing. */
// 個人中心，暫時不做，直接跳轉到首頁
router.get('/', function(req, res, next) {
	//var data = "";
	// var editor_id = req.session.editor_id;
	// console.log(editor_id);
	// editor.selectEditorSurveyData(editor_id, function(result){
	// 	if(result){
	// 		console.log(result);
	// 		res.render('index',  {title: '問卷系統',survey_id:result[0].survey_id, survey_name:result[0].survey_name, survey_description:result[0].survey_description,editor_id:req.session.editor_id,editor_name:req.session.editor_name});
	// 	}
	// });
    res.render('index', { title: '科展系統', member_id:req.session.member_id, member_name:req.session.member_name});
});

// 進入登入頁面
router.get('/login', function(req, res, next) {
  res.render('login',  {errmsg:''}); 
});

// 處理登入請求
router.post('/login', function(req, res, next) {
	var member_account = req.body.member_account || '',
		member_password = req.body.member_password || '';

	var password_hash = member.hash(member_password);
	//console.log(password_hash);
	member.login(member_account, password_hash, function(result){
		if(result.length){
			req.session.member_id = result[0].member_id;
			req.session.member_name = result[0].member_name;

			console.log( req.session.member_id );
			res.send({message:"true"});
		}else{
			//console.log(password_hash);
			res.send({message:"false"});
		}
	});
});

// 進入註冊頁面
router.get('/reg', function(req, res, next){
	res.render('reg', {errmsg:''});
});

// 處理註冊資料
router.post('/reg', function(req, res, next){
    var member_name = req.body.member_name || '',
		member_city = req.body.member_city || '',
		member_school = req.body.member_school || '',
		member_account = req.body.member_account || '';
		member_password = req.body.member_password || '';

	// if(member_password!=member_password2){
	// 	res.render('reg', {errmsg:'密碼不一致'});
	// 	return;
	// }
	var password_hash = member.hash(member_password);
	//console.log(password_hash);
	member.reg(member_name, member_city, member_school, member_account, password_hash, function(result){
		if(result.isExisted){
			res.send({message:"false"});
		}else if(result.affectedRows){

			res.redirect('/');
		}else{
			// console.log('註冊失敗，請重新嘗試');
			res.render('reg', {errmsg:'註冊失敗，請重新嘗試'});
		}
	});
	// res.render('reg', {errmsg:''});
});

// 進入專題管理頁面'
router.get('/projectManage', function(req, res, next){
	res.render('index', { title: '科展系統', member_id:req.session.member_id, member_name:req.session.member_name});
});

// 登出
router.get('/logout', function(req, res, next){
	req.session.destroy();
  res.redirect('/');
})

module.exports = router;
