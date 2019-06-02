var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Agencia Viajes' });
});
router.get('/', function(req, res, next) {
  res.render('layout', { title:'Agencia layout'});
})

module.exports = router;
