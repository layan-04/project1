// Import React hooks: useState for state, useEffect for lifecycle
import { useState, useEffect } from 'react';
// Import CSS file for styling the theme toggle button
import '../styles/ThemeToggle.css'

// Define ThemeToggle component
const ThemeToggle = () => {
  // State to store the current theme ("light" or "dark")
  // Initialize with value from localStorage if available, otherwise default to "light"
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  // useEffect runs whenever "theme" changes
  useEffect(() => {
    // Set the "data-theme" attribute on the <html> element to the current theme
    document.documentElement.setAttribute('data-theme', theme);
    // Save the current theme in localStorage so it persists across reloads
    localStorage.setItem('theme', theme);
  }, [theme]); // Dependency array: run effect whenever "theme" changes

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    // If theme is "light", switch to "dark"; otherwise switch to "light"
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Render JSX
  return (
    // Button with class "theme-toggle" that calls toggleTheme when clicked
    <button className="theme-toggle" onClick={toggleTheme}>
      {/* Show moon emoji if theme is light, sun emoji if theme is dark */}
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

// Export ThemeToggle component so it can be used in other files
export default ThemeToggle;
