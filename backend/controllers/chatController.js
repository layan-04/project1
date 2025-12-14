// import conversation model
const Conversation = require('../models/conversation') 

// import mongoose
const mongoose = require('mongoose') 

// import the service 
const {getBotResponse} = require('../services/chatbotService') 

// GET all chats
const getAllChats = async (req, res) => { // Define async function to fetch all chats for a user
    try {
        const userId = req.user._id // Extract user ID from request (added by authentication middleware)
        const allConversations = await Conversation.find({user: userId}).sort({createdAt: -1}) 
        // Find all conversations belonging to the user, sorted by newest first
        res.status(200).json(allConversations) // Return conversations with HTTP 200 status
    } catch (error) {
        res.status(400).json({error: 'Failed to get conversations'}) // Handle errors with HTTP 400 status
    }
}

// GET a single chat
const getSingleChat = async (req, res) => { // Define async function to fetch a single chat by ID
    try{
        const {id} = req.params // Extract chat ID from request parameters

        if (!mongoose.Types.ObjectId.isValid(id)){ 
            // Validate if ID is a proper MongoDB ObjectId
            return res.status(404).json({error: 'No conversation found'}) // Return error if invalid
        }

        const foundChat = await Conversation.findById(id) // Find conversation by ID

        if (!foundChat){
            return res.status(404).json({error: 'No conversation found'}) // Return error if not found
        }

        res.status(200).json(foundChat) // Return found conversation with HTTP 200 status

    } catch (error){
        res.status(400).json({error:'Failed to get conversation'}) // Handle errors with HTTP 400 status
    }
}

// Function to generate a topic from the first message
function generateTopic(message) {
            if (!message) return 'Untitled Conversation'; // If no message, default topic

            const keywords = message
                .split(' ') // Split message into words
                .slice(0, 5) // Take first 5 words
                .join(' ') // Join them back into a string
                .replace(/[?.!]/g, ''); // Remove punctuation marks

            return keywords.charAt(0).toUpperCase() + keywords.slice(1); 
            // Capitalize first letter and return as topic
}

// create a new chat
const createChat = async (req, res) => { // Define async function to create a new chat
    try {
        const userMessage = req.body.message // Extract user message from request body
        const user_id = req.user._id; // Extract user ID from authentication middleware

        if (!userMessage){
            return res.status(400).json({error:'Message is required'}) // Return error if message is missing
        }

        const botResponse = getBotResponse(userMessage) // Generate bot response using chatbot service

        const firstMessage = req.body.message; // Store first message
        const topic = generateTopic(firstMessage); // Generate topic from first message

        // Create new conversation document
        const chatSession = new Conversation({  
        user: user_id, // Assign user ID
        topic: generateTopic(userMessage), // Assign generated topic
        messages: [ // Store messages array
            {text: userMessage, isUser: true}, // User message
            {text: botResponse, isUser: false} // Bot response
        ]
    })

    await chatSession.save(); // Save conversation to database
    
    res.status(200).json({ // Return success response with both messages
        userMessage: userMessage,
        botResponse: botResponse
    })

    } catch (error){
        console.error('CreateChat error:', error); // Log error to console
        res.status(400).json({error:'Failed to save conversation'}) // Return error response
    }
}

// DELETE a chat
const deleteChat = async (req, res) => { // Define async function to delete a chat
    try{
        const {id} = req.params // Extract chat ID from request parameters

        if (!mongoose.Types.ObjectId.isValid(id)){ 
            // Validate ID format
            return res.status(404).json({error: 'No conversation found'}) // Return error if invalid
        }

        const deletedChat = await Conversation.findOneAndDelete({_id: id}) 
        // Delete conversation by ID

        if (!deletedChat){
            return res.status(404).json({error: 'No conversation found'}) // Return error if not found
        }

        res.status(200).json(deletedChat) // Return deleted conversation

    } catch (error){
        res.status(400).json({error:'Failed to delete conversation'}) // Handle errors
    }
}

// UPDATE a chat
const updateChat = async (req, res) => { // Define async function to update a chat
  try {
    const { id } = req.params; // Extract chat ID from request parameters
    const { message } = req.body; // Extract new message from request body
    const botResponse = getBotResponse(message); // Generate bot response

    const updatedChat = await Conversation.findByIdAndUpdate(
      id, // Find chat by ID
      {
        $push: { // Push new messages into messages array
          messages: [
            { text: message, isUser: true }, // User message
            { text: botResponse, isUser: false } // Bot response
          ]
        }
      },
      { new: true } // Return updated document instead of old one
    );

    res.status(200).json(updatedChat); // Return updated chat
  } catch (error) {
    res.status(400).json({ error: 'Failed to update conversation' }); // Handle errors
  }
};

// Export all functions for use in routes
module.exports = {
    getAllChats,
    getSingleChat,
    createChat,
    deleteChat,
    updateChat
}
