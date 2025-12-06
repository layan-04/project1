const express = require('express')

const router = express.Router()

const {loginUser, signupUser} = require('../controllers/userController')

//login route
router.post('/login', loginUser)

//signup route 
router.post('/signup', signupUser)


// Optional GET test pages for browser (safe)
router.get('/login', (req, res) => res.send('<h1>Login Page</h1>'));
router.get('/signup', (req, res) => res.send('<h1>Signup Page</h1>'));



module.exports = router