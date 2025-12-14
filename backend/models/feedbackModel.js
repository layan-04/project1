// Import mongoose library to define schemas and interact with MongoDB
const mongoose = require('mongoose');

// Define a new schema for feedback documents
const feedbackSchema = new mongoose.Schema({
  // Name of the person giving feedback (string, required field)
  name: { type: String, required: true },

  // Email address of the person giving feedback (string, required field)
  email: { type: String, required: true },

  // The actual feedback text provided by the user (string, required field)
  feedback: { type: String, required: true },

  // Timestamp for when the feedback was created (defaults to current date/time)
  createdAt: { type: Date, default: Date.now }
});

// Export the Feedback model based on the feedbackSchema
// This allows other parts of the application to interact with the 'Feedback' collection in MongoDB
module.exports = mongoose.model('Feedback', feedbackSchema);
