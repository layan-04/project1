// Import the User model
const User = require('../models/user.js')

// Import bcrypt library for hashing and comparing passwords
const bcrypt = require('bcrypt')

// Import jsonwebtoken library for creating and verifying JWT tokens
const jwt = require('jsonwebtoken')

// Function to create a JWT token using the user's ID
const createToken = (_id) => {
    // Sign a new token with the user's ID, secret key from environment variables, and set expiration to 1 day
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}

// login user
const loginUser = async (req, res) => { // Define async function to handle user login
    const {email, password} = req.body // Extract email and password from request body

    try {
        const user = await User.login(email, password) 
        // Call the custom login method on User model to validate credentials

        // create a token
        const token = createToken(user._id) 
        // Generate a JWT token for the authenticated user

        res.status(200).json({email, token}) 
        // Respond with HTTP 200 and return email + token
    } catch (error) {
        res.status(400).json({error: error.message}) 
        // If login fails, respond with HTTP 400 and error message
    }
}

// signup user
const signupUser = async (req, res) => { // Define async function to handle user signup
    const {email, password} = req.body // Extract email and password from request body

    try {
        const user = await User.signup(email, password) 
        // Call the custom signup method on User model to create a new user

        // create a token
        const token = createToken(user._id) 
        // Generate a JWT token for the newly registered user

        res.status(200).json({email, token}) 
        // Respond with HTTP 200 and return email + token
    } catch (error) {
        console.error('Signup error:', error.message); 
        // Log signup error to console for debugging
        res.status(400).json({error: error.message}) 
        // If signup fails, respond with HTTP 400 and error message
    }
}

// Export loginUser and signupUser functions so they can be used in routes/controllers
module.exports = {loginUser, signupUser}
