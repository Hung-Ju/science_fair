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
    res.render('index', { title: '科展系統', editor_id:req.session.editor_id, editor_name:req.session.editor_name});
});

// 進入登入頁面
router.get('/login', function(req, res, next) {
  res.render('login',  {errmsg:''}); 
});

// 處理登入請求
router.post('/login', function(req, res, next) {
	// console.log(req.body.editor_account, req.body.editor_password);
	var editor_account = req.body.editor_account || '',
			editor_password = req.body.editor_password || '';

	var password_hash = editor.hash(editor_password);

	editor.login(editor_account, password_hash, function(result){
		//console.log(result);
		if(result.length){
			// console.log( req.session );
			req.session.editor_id = result[0].editor_id;
			req.session.editor_name = result[0].editor_name;

			console.log( req.session.editor_id );
			res.redirect('/editor/surveyManage');
		}else{
			// console.log('登入失敗');
			res.render('login', {errmsg:'帳號或密碼錯誤'});
		}
	});
});

// 進入註冊頁面
router.get('/reg', function(req, res, next){
	res.render('reg', {errmsg:''});
});

// 處理註冊資料
router.post('/reg', function(req, res, next){
    var editor_name = req.body.editor_name || '',
            editor_account = req.body.editor_account || '',
			editor_password = req.body.editor_password || '',
			editor_password2 = req.body.editor_password2 || '';

	if(editor_password!=editor_password2){
		res.render('reg', {errmsg:'密碼不一致'});
		return;
	}
	var password_hash = editor.hash(editor_password);
	editor.reg(editor_name, editor_account, password_hash, function(result){
		if(result.isExisted){
			res.render('reg', {errmsg:'使用者已存在'});
		}else if(result.affectedRows){

			// req.session.editor_id = result[0].editor_id;
			// req.session.editor_name = result[0].editor_name;

			res.redirect('/');
		}else{
			// console.log('註冊失敗，請重新嘗試');
			res.render('reg', {errmsg:'註冊失敗，請重新嘗試'});
		}
	});
	// res.render('reg', {errmsg:''});
});

// 登出
router.get('/logout', function(req, res, next){
	req.session.destroy();
  res.redirect('/');
})

module.exports = router;
