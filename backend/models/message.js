// Import mongoose library to define schemas and interact with MongoDB
const mongoose = require('mongoose')

// Define a new schema for messages
const messageSchema = new mongoose.Schema({
    // The actual text content of the message
    text:{
        type: String,       // Message must be a string
        required: true      // Message text is required
    },
    // Flag to indicate whether the message was sent by the user or the bot
    isUser:{
        type: Boolean,      // Boolean value: true if user, false if bot
        required: true      // This field is required
    },
},
    // Add timestamps to automatically store createdAt and updatedAt fields
    { timestamps: true } // add the createdAt, updatedAt
)

// Export both the Message model and the schema itself
module.exports = { 
    // Create and export a Mongoose model named 'Message' based on messageSchema
    message: mongoose.model('Message', messageSchema),

    // Also export the raw schema so it can be reused in other schemas (e.g., Conversation)
    messageSchema : messageSchema 
}
