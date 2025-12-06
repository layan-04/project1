//import express framework
const express = require('express')

//grab the controllers (chat functions) 
const {
    getAllChats,
    getSingleChat,
    createChat,
    deleteChat,
    updateChat
} = require('../controllers/chatController')

const router = express.Router()

const requireAuth = require('../middleware/requireAuth')

//require auth for all routes
router.use(requireAuth)

// GET all chats (view all saved conversations)
router.get('/', getAllChats)

// GET a single chat (view a specific conversation)
router.get('/:id', getSingleChat)

// create a new chat (user sends a message and gets a bot response)
router.post('/', createChat)

// DELETE a chat
router.delete('/:id', deleteChat)

// UPDATE a chat 
router.patch('/:id', updateChat);


module.exports = router