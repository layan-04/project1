//import conversation model
const Conversation = require('../models/conversation')

//import mongoose
const mongoose = require('mongoose')

//import the service 
const {getBotResponse} = require('../services/chatbotService')

//GET all chats
const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id
        const allConversations = await Conversation.find({user: userId}).sort({createdAt: -1})
        res.status(200).json(allConversations)
    } catch (error) {
        res.status(400).json({error: 'Failed to get conversations'})
    }
}

//GET a single chat
const getSingleChat = async (req, res) => {
    try{
        const {id} = req.params

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No conversation found'})
        }

        const foundChat = await Conversation.findById(id)

        if (!foundChat){
            return res.status(404).json({error: 'No conversation found'})
        }

        res.status(200).json(foundChat)

    } catch (error){
        res.status(400).json({error:'Failed to get conversation'})
    }
}


//

function generateTopic(message) {
            if (!message) return 'Untitled Conversation';

            const keywords = message
                .split(' ')
                .slice(0, 5)
                .join(' ')
                .replace(/[?.!]/g, '');

            return keywords.charAt(0).toUpperCase() + keywords.slice(1);
            }




//create a new chat
const createChat = async (req, res) => {
    try {
        const userMessage = req.body.message
        const user_id = req.user._id; // added from requireAuth middleware

        if (!userMessage){
            return res.status(400).json({error:'Message is required'})
        }

        const botResponse = getBotResponse(userMessage)

        const firstMessage = req.body.message;
        const topic = generateTopic(firstMessage);

        
        const chatSession = new Conversation({  
        user: user_id,
        topic: generateTopic(userMessage),
        messages: [
            {text: userMessage, isUser: true},
            {text: botResponse, isUser: false}
        ]
    })

    await chatSession.save();
    
    res.status(200).json({
        userMessage: userMessage,
        botResponse: botResponse
    })

    } catch (error){
        console.error('CreateChat error:', error);
        res.status(400).json({error:'Failed to save conversation'})
    }
}

//DELETE a chat
const deleteChat = async (req, res) => {
    try{
        const {id} = req.params

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No conversation found'})
        }

        const deletedChat = await Conversation.findOneAndDelete({_id: id})

        if (!deletedChat){
            return res.status(404).json({error: 'No conversation found'})
        }

        res.status(200).json(deletedChat)

    } catch (error){
        res.status(400).json({error:'Failed to delete conversation'})
    }
}

//UPDATE a chat
const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const botResponse = getBotResponse(message);

    const updatedChat = await Conversation.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: [
            { text: message, isUser: true },
            { text: botResponse, isUser: false }
          ]
        }
      },
      { new: true }
    );

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update conversation' });
  }
};


module.exports = {
    getAllChats,
    getSingleChat,
    createChat,
    deleteChat,
    updateChat
}