import { useState, useEffect } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Redirect immediately if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await signup(email, password);
    if (success) {
      // Navigate after successful signup
      navigate('/');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>

        <label>Email:</label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
