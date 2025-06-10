const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()

const checkAuth = require('../middleware/check-auth')

const UserController = require('../controllers/user')

router.post('/signup', UserController.user_signup)

router.post('/login', UserController.user_login)

router.delete('/:userId', checkAuth, UserController.user_delete)

module.exports = router

