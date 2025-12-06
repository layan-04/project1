const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedbackModel'); // create a Mongoose model

// POST feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;
