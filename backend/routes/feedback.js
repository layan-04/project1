// Import the Express framework
const express = require('express');

// Create a new router object using Express
const router = express.Router();

// Import the Feedback model (Mongoose schema) to interact with the feedback collection in MongoDB
const Feedback = require('../models/feedbackModel'); // create a Mongoose model

// Define a POST route for submitting feedback
router.post('/', async (req, res) => {
  try {
    // Extract name, email, and feedback fields from the request body
    const { name, email, feedback } = req.body;

    // Create a new Feedback document using the extracted data
    const newFeedback = new Feedback({ name, email, feedback });

    // Save the new feedback document to the database
    await newFeedback.save();

    // Respond with HTTP 201 (Created) and a success message
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    // If an error occurs, respond with HTTP 500 (Internal Server Error) and an error message
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Export the router so it can be used in the main application (e.g., app.js)
module.exports = router;
