const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

router.post('/register', authController.signIn);
router.post('/login', authController.logIn);
router.post('/auth', authController.isAuthenticated);

module.exports = router