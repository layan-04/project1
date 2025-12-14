// Import the jsonwebtoken library to handle JWT creation and verification
const jwt = require('jsonwebtoken')

// Import the User model from the models directory
const User = require('../models/user.js')

// Middleware function to require authentication before accessing protected routes
const requireAuth = async (req, res, next) => {

    // verify authentication
    const {authorization} = req.headers // Extract the 'authorization' header from the incoming request

    if (!authorization){ 
        // If no authorization header is provided, return 401 Unauthorized
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = authorization.split(' ')[1] 
    // Extract the token part from the "Bearer <token>" format by splitting on space

    try {
        const {_id} = jwt.verify(token, process.env.SECRET) 
        // Verify the token using the secret key from environment variables
        // Extract the user ID (_id) from the decoded token payload

        req.user = await User.findOne({_id}).select('_id') 
        // Find the user in the database by ID and attach it to the request object
        // Only select the _id field for efficiency

        next() 
        // Call next() to pass control to the next middleware or route handler

    } catch (error) {
        console.log(error) 
        // Log any error that occurs during token verification or user lookup
        res.status(401).json({error: 'Request is not authorized'}) 
        // Return 401 Unauthorized if verification fails
    }

}

// Export the middleware so it can be used in other parts of the application
module.exports = requireAuth
