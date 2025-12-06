const mongoose = require('mongoose')
const {messageSchema} = require('./message')

const conversationSchema = new mongoose.Schema({
    //id: {
        //type: String, //the id field will store a string that uniquely identifies a conversation (might remove after if i didnt know how to do it)
        //required: true
    //},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    messages: [messageSchema], //follows the rule of the messageSchema
},
    { timestamps: true }
)


module.exports = mongoose.model('Conversation', conversationSchema);
//module.exports = conversationSchema;