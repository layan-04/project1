import { Link } from 'react-router-dom';
import '../styles/home.css'; // include all styles here

const Home = () => {
  return (
    <div className="home">
      <h2>Explore Your Cyber Tools</h2>
      <div className="card-container">
        <div className="tool-card">
          <h3>💬 Cyber Awareness Chatbot</h3>
          <p>Ask questions, and get instant security advice.</p>
          <Link to="/chatbot">
            <button>Try Chatbot</button>
          </Link>
        </div>

        <div className="tool-card">
          <h3>🔑 Password Strength Checker</h3>
          <p>Test your password’s strength and get tips to improve it.</p>
          <Link to="/passwordchecker">
            <button>Check Password</button>
          </Link>
        </div>

        <div className="tool-card">
          <h3>🧠 Security Quiz</h3>
          <p>Challenge your knowledge, and see your score at the end.</p>
          <Link to="/security-quiz">
            <button>Take the Quiz</button>
            </Link>
        </div>
        
        <div className="tool-card">
          <h3>🛡️ URL Checker</h3>
          <p>Verify if a URL is safe, suspicious, or potentially harmful before visiting.</p>
          <Link to="/url-scanner">
            <button>Check URL</button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
