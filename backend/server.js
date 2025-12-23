// Load environment variables from the .env file in this folder
require('dotenv').config({ path: __dirname + '/.env' })

// Import the Express framework
const express = require('express')

// Import the CORS middleware (allows cross‑origin requests)
const cors = require('cors')

// Import chat routes from the routes folder
const chatRoutes = require('./routes/chat.routes.js')

// Import user routes from the routes folder
const userRoutes = require('./routes/user.routes.js')

// Import URL scanner routes
const urlScanRoutes = require('./routes/urlScan.js');

// Import feedback routes
const feedbackRoutes = require('./routes/feedback.js');

// Import Mongoose (used to connect and work with MongoDB)
const mongoose = require('mongoose')

// Create an Express app (this will handle web requests)
const app = express()

// Middleware to automatically parse JSON data in requests
app.use(express.json())

// Enable CORS so the frontend can talk to this backend
app.use(cors({
  origin: 'https://www.cybershield-bh.com', // Only allow requests from this frontend URL
  credentials: true, // Allow cookies or authorization headers to be sent
}));

// Middleware to log every request path and method (for debugging)
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next() // Move on to the next middleware/route
})

// Routes for different parts of the app
app.use('/api/chat', chatRoutes)        // Chat endpoints
app.use('/api/user', userRoutes)        // User login/signup endpoints
app.use('/api/feedback', feedbackRoutes); // Feedback endpoints
app.use('/api/tools/url-scanner', urlScanRoutes); //url scan endpoints

// Simple warm-up endpoint
app.get('/ping', async (req, res) => {
  // Optional: touch the database or any heavy service here
  // For example, run a lightweight query to keep DB connections alive
  await mongoose.connection.db.admin().ping();
  
  res.send('pong');
});


// Connect to MongoDB using the connection string in .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // If connection succeeds, start the server
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        // If connection fails, log the error
        console.log(error)
    })
    