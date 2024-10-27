var express = require('express');
var router = express.Router();
const path = require('path');

const isUserAuthenticated = require('../middleware/UserAuth');
router.get('/', isUserAuthenticated, function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  });

router.get('/products', isUserAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/products.html'));
}); 


router.get('/custom', isUserAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/custom.html'));
}); 

router.get('/contact', isUserAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/contact.html'));
}); 


const isAuthenticated = require('../middleware/auth');

router.get('/admin', isAuthenticated, function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
});




router.get('/adminLogin', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/adminLogin.html'));
});

router.get('/userLogin', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/userLogin.html'));
});

router.get('/userSignup', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.get('/adminUsers', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/adminUsers.html'));
});






module.exports = router;