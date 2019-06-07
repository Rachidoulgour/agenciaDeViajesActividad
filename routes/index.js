var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/register', (req,res) => res.render('register.hbs'));
router.get('/', (req,res) => res.render('index.hbs'));
router.get('/login', (req,res) => res.render('login.hbs'));
router.get('/recovery', (req,res) => res.render('recovery.hbs'));

module.exports = router;
