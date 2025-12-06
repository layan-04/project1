const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    isUser:{
        type: Boolean,
        required: true
    },
},
    { timestamps: true } //add the createdAt, updatedAt
)

module.exports = { 
    message: mongoose.model('Message', messageSchema),
    messageSchema : messageSchema 
}