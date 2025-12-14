// Import Link component from React Router for navigation
import { Link } from 'react-router-dom';
// Import custom hook to handle logout functionality
import { useLogout } from '../hooks/useLogout';
// Import custom hook to access authentication context (user info)
import { useAuthContext } from '../hooks/useAuthContext';
// Import useState hook from React for managing component state
import { useState } from 'react';
// Import CSS file for Navbar styling
import '../styles/Navbar.css';
// Import ThemeToggle component for switching light/dark mode
import ThemeToggle from './ThemeToggle'

// Define Navbar component
const Navbar = () => {
  // Get logout function from custom hook
  const { logout } = useLogout();
  // Get current user from authentication context
  const { user } = useAuthContext();
  // State to track if user dropdown menu is open
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  // State to track if hamburger menu is open
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Function to handle logout
  const handleLogout = () => {
    logout(); // Call logout function
    setUserDropdownOpen(false); // Close user dropdown after logout
  };

  // Return JSX for rendering Navbar
  return (
    <header className="navbar"> {/* Navbar header */}
  <div className="container"> {/* Container for navbar content */}
    {/* Navigation Links */}
    <nav className="nav-links"> {/* Navigation section */}
      <Link to="/">Home</Link> {/* Link to Home page */}
      <Link to="/chatbot">Chatbot</Link> {/* Link to Chatbot page */}
      <Link to="/passwordchecker">Password Strength</Link> {/* Link to Password Checker page */}
      <Link to="/tools/url-scanner">URL Checker</Link> {/* Link to URL Scanner page */}
      <Link to="/security-quiz">Security Quiz</Link> {/* Link to Security Quiz page */}
    </nav>

    {/* Right-side controls: hamburger + user */}
    <div className="right-controls"> {/* Right side of navbar */}
      <ThemeToggle /> {/* Theme toggle button */}
      <div className="hamburger-menu"> {/* Hamburger menu container */}
        <div
          className="hamburger-icon" // Hamburger icon
          onClick={() => setHamburgerOpen(!hamburgerOpen)} // Toggle hamburger menu open/close
        >
          <div className="line"></div> {/* Line 1 of hamburger icon */}
          <div className="line"></div> {/* Line 2 of hamburger icon */}
          <div className="line"></div> {/* Line 3 of hamburger icon */}
        </div>
        {hamburgerOpen && ( // If hamburger menu is open
          <div className="menu-dropdown"> {/* Dropdown menu */}
            <Link to="/feedback" onClick={() => setHamburgerOpen(false)}> {/* Feedback link */}
              Feedback
            </Link>
          </div>
        )}
      </div>

      {user && ( // If user is logged in
        <div className="user-menu"> {/* User menu container */}
          <div
            className="user-icon" // User icon
            onClick={() => setUserDropdownOpen(!userDropdownOpen)} // Toggle user dropdown open/close
          >
            👤 {/* User icon emoji */}
          </div>
          {userDropdownOpen && ( // If user dropdown is open
            <div className="dropdown"> {/* Dropdown menu */}
              <div className="user-email">{user.email}</div> {/* Show user email */}
              <button className="logout-btn" onClick={handleLogout}> {/* Logout button */}
                Log Out
              </button>
            </div>
          )}
        </div>
      )}

      {!user && ( // If no user is logged in
        <div className="auth-links"> {/* Authentication links */}
          <Link to="/login">Login</Link> {/* Link to Login page */}
          <Link to="/signup">Sign up</Link> {/* Link to Signup page */}
        </div>
      )}
    </div>
  </div>
</header>

  );
};

// Export Navbar component so it can be used in other files
export default Navbar;
