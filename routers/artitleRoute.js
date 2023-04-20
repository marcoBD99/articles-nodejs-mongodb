'use strict'

var express = require('express');
var ArticleController = require('../controllers/articleController')

var router = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./upload/articles'});


router.post('/save-article',ArticleController.save);
router.get('/get-all-articles/:last?',ArticleController.getArticles);
router.get('/article/:id',ArticleController.getArticle);
router.put('/article/:id',ArticleController.updateArticle);
router.delete('/article/:id',ArticleController.deleteArticle);
router.post('/upload-image/:id?',md_upload,ArticleController.uploadImage);
router.get('/get-image/:image',ArticleController.getImage);
router.get('/search-article/:search',ArticleController.search);


module.exports= router;