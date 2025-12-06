import { Link } from 'react-router-dom';

const AuthChoice = () => {
  return (
    <div className="auth-choice">
      <h2>To chat</h2>
      <p>Please choose how you'd like to continue:</p>
      <div className="auth-buttons">
        <Link to="/login">
          <button>Log In</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default AuthChoice;
