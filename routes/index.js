var express = require('express');
var router = express.Router();

var indexController = require('../controller/index')
var hooksController = require('../controller/git-hooks')

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', indexController.init);
});

router.post('/hooks', hooksController.init)

module.exports = router;
