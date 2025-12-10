require('dotenv').config({ path: __dirname + '/.env' })

//import express module 
const express = require('express')

//import CORS
const cors = require('cors')

//bring in the chat routes from this file
const chatRoutes = require('./routes/chat.routes.js')

//bring in the user routes from this file
const userRoutes = require('./routes/user.routes.js')

//url
const urlScanRoutes = require('./routes/urlScan.js');

//feedback
const feedbackRoutes = require('./routes/feedback.js');

//import mongoose module
const mongoose = require('mongoose')

//sets up an express app to handle web requests 
const app = express()


//needed to read JSON 
app.use(express.json())


app.use(cors({
  origin: 'https://www.cybershield-bh.com', // your deployed frontend URL
  credentials: true, // if you are sending cookies or auth headers
}));


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/chat', chatRoutes)
app.use('/api/user', userRoutes)
app.use('/api/feedback', feedbackRoutes);

//url
app.use('/api/tools/url-scanner', urlScanRoutes);



//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
        console.log('connected to db and listening on port', process.env.PORT)
})
    })
    .catch((error) => {
        console.log(error)
    })


//const PORT = process.env.PORT || 4000;
//app.listen(PORT, () => {
 // console.log('Listening on port', PORT);
//});


//connect to db





   


