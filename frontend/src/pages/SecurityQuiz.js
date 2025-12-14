// Import useState hook from React for managing state
import { useState } from 'react';
// Import CSS file for styling the quiz
import '../styles/SecurityQuiz.css'; // Optional: move styles here or inline

// Define SecurityQuiz component
const SecurityQuiz = () => {
  // Quiz data: array of questions, options, correct answer index, and explanation
  const quizData = [
    {
      question: "What is the most secure way to store your passwords?", // Question text
      options: [ // Multiple choice options
        "Write them down in a notebook",
        "Use the same password everywhere",
        "Store them in a password manager",
        "Email them to yourself"
      ],
      answer: 2, // Correct option index (0-based)
      explanation: "Password managers encrypt and securely store your passwords, unlike physical or email storage." // Explanation text
    },
    {
      question: "Which of the following is a sign of a phishing email?",
      options: [
        "A personalized greeting",
        "A request for urgent action with a suspicious link",
        "An email from your known contact",
        "A message with perfect grammar and spelling"
      ],
      answer: 1,
      explanation: "Phishing emails often create urgency and include suspicious links to trick users."
    },
    {
      question: "What does 2FA (Two-Factor Authentication) add to your login process?",
      options: [
        "A second password",
        "A backup email",
        "An additional layer of security",
        "A longer username"
      ],
      answer: 2,
      explanation: "2FA adds a second verification step, like a code or biometric, to enhance security."
    },
    {
      question: "Which password is the strongest?",
      options: [
        "12345678",
        "P@ssw0rd",
        "ilovecats",
        "T!9v#2Lq$8mZ"
      ],
      answer: 3,
      explanation: "Strong passwords are long, random, and include a mix of characters."
    },
    {
      question: "What should you do if you suspect your account was hacked?",
      options: [
        "Ignore it and hope it stops",
        "Change your password immediately",
        "Delete your account",
        "Post about it on social media"
      ],
      answer: 1,
      explanation: "Changing your password and enabling 2FA are the first steps to secure a compromised account."
    }
  ];

  // State to track current question index
  const [current, setCurrent] = useState(0);
  // State to track selected option index
  const [selected, setSelected] = useState(null);
  // State to track user score
  const [score, setScore] = useState(0);
  // State to show explanation after answering
  const [showExplanation, setShowExplanation] = useState(false);

  // Current question object based on index
  const question = quizData[current];

  // Function to handle answer selection
  const handleAnswer = (index) => {
    setSelected(index); // Save selected option
    setShowExplanation(true); // Show explanation
    if (index === question.answer) { // If correct answer
      setScore(score + 1); // Increase score
    }
  };

  // Function to move to next question
  const nextQuestion = () => {
    setSelected(null); // Reset selected option
    setShowExplanation(false); // Hide explanation
    setCurrent(current + 1); // Go to next question
  };

  // Return JSX for rendering quiz
  return (
    <div className="quiz-page"> {/* Page container */}
      <div className="quiz-container"> {/* Quiz container */}
        {current < quizData.length ? ( // If there are questions left
          <>
            <div className="quiz-header"> {/* Header with question counter and score */}
              <span className="question-counter">Question {current + 1} of {quizData.length}</span>
              <span className="current-score">Score: {score}</span>
            </div>
            
            <h2>{question.question}</h2> {/* Display current question */}
            
            <ul className="options-list"> {/* Options list */}
              {question.options.map((opt, i) => ( // Loop through options
                <li key={i}> {/* List item for each option */}
                  <button
                    className={`option-button ${selected === i ? (i === question.answer ? 'correct' : 'incorrect') : ''} ${selected !== null && i === question.answer ? 'show-correct' : ''}`} // Apply classes based on selection and correctness
                    onClick={() => handleAnswer(i)} // Handle answer click
                    disabled={selected !== null} // Disable buttons after selection
                  >
                    {opt} {/* Show option text */}
                  </button>
                </li>
              ))}
            </ul>
            
            {showExplanation && ( // Show explanation if enabled
              <div className="explanation"> {/* Explanation box */}
                <h4>Explanation</h4>
                <p>{question.explanation}</p> {/* Show explanation text */}
                <button className="next-button" onClick={nextQuestion}> {/* Next question button */}
                  {current < quizData.length - 1 ? 'Next Question' : 'See Results'} {/* Change text based on progress */}
                </button>
              </div>
            )}
          </>
        ) : ( // If quiz is complete
          <div className="results"> {/* Results container */}
            <h2>Quiz Complete!</h2> {/* Completion message */}
            <div className="score-display"> {/* Score display */}
              <span className="final-score">{score}</span> {/* Final score */}
              <span className="total-questions">/ {quizData.length}</span> {/* Total questions */}
            </div>
            <p className="score-message"> {/* Score message */}
              {score === quizData.length ? "Perfect! You're a security expert!" :
               score >= quizData.length * 0.7 ? "Great job! You know your security basics." :
               score >= quizData.length * 0.5 ? "Good effort! Keep learning about security." :
               "Keep studying! Security is important."}
            </p>
            <button className="restart-button" onClick={() => window.location.reload()}> {/* Restart button */}
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Export SecurityQuiz component so it can be used in other files
export default SecurityQuiz;
