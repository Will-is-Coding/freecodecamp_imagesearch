'use strict';

var path = process.cwd();
var imageSearch = require('../will-is-coding/imagesearch.js');
var router = require('express').Router();

router.get('/imagesearch/*', function(req, res) {
	imageSearch.search(req.originalUrl, res);
});

router.get('/latest/imagesearch/', function(req, res) {
	imageSearch.recentSearches(res);
});

module.exports = router;