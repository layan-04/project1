import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import '../styles/Navbar.css';
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

  return (
    <header className="navbar">
  <div className="container">
    {/* Navigation Links */}
    <nav className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/Chatbot">Chatbot</Link>
      <Link to="/Passwordchecker">Password Strength</Link>
      <Link to="/tools/url-scanner">URL Checker</Link>
      <Link to="/security-quiz">Security Quiz</Link>
    </nav>

    {/* Right-side controls: hamburger + user */}
    <div className="right-controls">
      <ThemeToggle />
      <div className="hamburger-menu">
        <div
          className="hamburger-icon"
          onClick={() => setHamburgerOpen(!hamburgerOpen)}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        {hamburgerOpen && (
          <div className="menu-dropdown">
            <Link to="/feedback" onClick={() => setHamburgerOpen(false)}>
              Feedback
            </Link>
          </div>
        )}
      </div>

      {user && (
        <div className="user-menu">
          <div
            className="user-icon"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            👤
          </div>
          {userDropdownOpen && (
            <div className="dropdown">
              <div className="user-email">{user.email}</div>
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="auth-links">
          <Link to="/Login">Login</Link>
          <Link to="/Signup">Sign up</Link>
        </div>
      )}
    </div>
  </div>
</header>

  );
};

export default Navbar;