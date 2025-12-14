// Import useState hook from React for managing component state
import { useState } from 'react';
// Import CSS file for styling the feedback form
import '../styles/FeedbackForm.css';

// Define FeedbackForm component
const FeedbackForm = () => {
  // State to store form input values (name, email, feedback)
  const [formData, setFormData] = useState({
    name: '',     // initial empty name
    email: '',    // initial empty email
    feedback: ''  // initial empty feedback
  });
  // State to track if form has been submitted
  const [submitted, setSubmitted] = useState(false);

  // Function to handle input changes
  const handleChange = (e) => {
    // Extract name and value from the event target (input field)
    const { name, value } = e.target;
    // Update formData state by keeping previous values and updating the changed field
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload

    // Validate that all fields are filled
    if (!formData.name || !formData.email || !formData.feedback) {
      alert('Please fill in all fields.'); // Show alert if any field is empty
      return; // Stop submission
    }

    try {
      // Send POST request to backend feedback API
      const response = await fetch('https://project1-3-ow0y.onrender.com/api/feedback', {
        method: 'POST', // HTTP method
        headers: { 'Content-Type': 'application/json' }, // Send JSON data
        body: JSON.stringify(formData), // Request body with form data
      });

      // If response is successful
      if (response.ok) {
        setSubmitted(true); // Mark form as submitted
        // Reset form fields to empty
        setFormData({ name: '', email: '', feedback: '' });
      } else {
        // If response not OK, show error alert
        alert('Error sending feedback');
      }
    } catch (error) {
      // Log error to console
      console.error('Error:', error);
      // Show server error alert
      alert('Server error');
    }
  };

  // Return JSX for rendering
  return (
    <div className="feedback-form"> {/* Container div with CSS class */}
      <h2>Feedback Form</h2> {/* Title */}
      {/* Show success message if submitted */}
      {submitted && <p className="success">Thank you for your feedback!</p>}
      {/* Feedback form with submit handler */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label> {/* Label for name input */}
          <input 
            type="text" // Input type text
            name="name" // Field name
            value={formData.name} // Bind value to state
            onChange={handleChange} // Update state on change
            placeholder="Enter your name" // Placeholder text
          />
        </div>
        <div>
          <label>Email:</label> {/* Label for email input */}
          <input 
            type="email" // Input type email
            name="email" // Field name
            value={formData.email} // Bind value to state
            onChange={handleChange} // Update state on change
            placeholder="Enter your email" // Placeholder text
          />
        </div>
        <div>
          <label>Feedback:</label> {/* Label for feedback textarea */}
          <textarea 
            name="feedback" // Field name
            value={formData.feedback} // Bind value to state
            onChange={handleChange} // Update state on change
            placeholder="Write your feedback here..." // Placeholder text
          />
        </div>
        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// Export FeedbackForm component so it can be used in other files
export default FeedbackForm;
