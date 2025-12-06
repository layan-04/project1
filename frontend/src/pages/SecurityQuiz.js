import { useState } from 'react';
import '../styles/SecurityQuiz.css'; // Optional: move styles here or inline

const SecurityQuiz = () => {
  const quizData = [
    {
      question: "What is the most secure way to store your passwords?",
      options: [
        "Write them down in a notebook",
        "Use the same password everywhere",
        "Store them in a password manager",
        "Email them to yourself"
      ],
      answer: 2,
      explanation: "Password managers encrypt and securely store your passwords, unlike physical or email storage."
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

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quizData[current];

  const handleAnswer = (index) => {
    setSelected(index);
    setShowExplanation(true);
    if (index === question.answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowExplanation(false);
    setCurrent(current + 1);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {current < quizData.length ? (
          <>
            <div className="quiz-header">
              <span className="question-counter">Question {current + 1} of {quizData.length}</span>
              <span className="current-score">Score: {score}</span>
            </div>
            
            <h2>{question.question}</h2>
            
            <ul className="options-list">
              {question.options.map((opt, i) => (
                <li key={i}>
                  <button
                    className={`option-button ${selected === i ? (i === question.answer ? 'correct' : 'incorrect') : ''} ${selected !== null && i === question.answer ? 'show-correct' : ''}`}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
            
            {showExplanation && (
              <div className="explanation">
                <h4>Explanation</h4>
                <p>{question.explanation}</p>
                <button className="next-button" onClick={nextQuestion}>
                  {current < quizData.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="results">
            <h2>Quiz Complete!</h2>
            <div className="score-display">
              <span className="final-score">{score}</span>
              <span className="total-questions">/ {quizData.length}</span>
            </div>
            <p className="score-message">
              {score === quizData.length ? "Perfect! You're a security expert!" :
               score >= quizData.length * 0.7 ? "Great job! You know your security basics." :
               score >= quizData.length * 0.5 ? "Good effort! Keep learning about security." :
               "Keep studying! Security is important."}
            </p>
            <button className="restart-button" onClick={() => window.location.reload()}>
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityQuiz;
