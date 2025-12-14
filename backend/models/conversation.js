// Import mongoose library to define schemas and interact with MongoDB
const mongoose = require('mongoose')

// Import the messageSchema from the message.js file
const {messageSchema} = require('./message')

// Define a new schema for conversations
const conversationSchema = new mongoose.Schema({
    // Reference to the user who owns the conversation
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Topic of the conversation (string, required)
    topic: { type: String, required: true },

    // Array of messages that follow the structure defined in messageSchema
    messages: [messageSchema], // follows the rule of the messageSchema
},
    // Add timestamps to automatically store createdAt and updatedAt fields
    { timestamps: true }
)

// Export the Conversation model based on the conversationSchema
module.exports = mongoose.model('Conversation', conversationSchema);
