// Import mongoose library to define schemas and interact with MongoDB
const mongoose = require('mongoose')

// Import bcrypt library for hashing and comparing passwords securely
const bcrypt = require('bcrypt');

// Import validator library to validate email format and password strength
const validator = require('validator')

// create new schema shortcut
const Schema = mongoose.Schema // Assign mongoose.Schema to a variable for convenience

// Import the conversation schema (used for referencing conversations in the user schema)
const conversationSchema = require('./conversation.js');

// Define a new schema for users
const userSchema = new mongoose.Schema({
    // User email field
    email: {
        type: String,       // Must be a string
        required: true,     // Email is required
        unique: true,       // Email must be unique across all users
    },
    // User password field
    password: {
        type: String,       // Must be a string
        required: true,     // Password is required
        minlength: 5,       // Minimum length of 5 characters
        //select: false // Uncommenting this would prevent password from being returned in queries
    },
    // Array of conversation references linked to the user
    conversations: [{
        type: mongoose.Schema.Types.ObjectId, // Each conversation is stored by its ObjectId
        ref: 'Conversation'                   // Reference to the Conversation model
    }]
},
    // Add timestamps to automatically store createdAt and updatedAt fields
    { timestamps: true } // add the createdAt, updatedAt
)

// static signup method (attached directly to the User model)
userSchema.statics.signup = async function (email, password) {

    // validation: check if email and password are provided
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    // validate email format
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    // validate password strength (must meet strong password criteria)
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough')
    }

    // check if a user with the same email already exists
    const exists = await this.findOne({email})

    if (exists) {
        throw Error ('Email already in use')
    }

    // generate a salt for hashing
    const salt = await bcrypt.genSalt(10)
    // hash the password with the salt
    const hash = await bcrypt.hash(password, salt)

    // create a new user with hashed password
    const user = await this.create({email, password: hash})

    // return the newly created user
    return user
}

// static login method (attached directly to the User model)
userSchema.statics.login = async function (email, password) {
    
    // validation: check if email and password are provided
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    // find user by email
    const user = await this.findOne({email})

    if (!user) {
        throw Error('Incorrect email') // throw error if user not found
    }

    // compare provided password with stored hashed password
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password') // throw error if passwords don't match
    }

    // return the user if login is successful
    return user
}

// Export the User model based on the userSchema
module.exports = mongoose.model('User', userSchema);
