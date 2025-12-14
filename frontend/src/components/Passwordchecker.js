// Import useState hook from React for managing state
import { useState } from 'react'
// Import CSS file for styling the password checker
import '../styles/Passwordchecker.css'

// Define PasswordChecker component
const PasswordChecker = () => {
  // State to store the entered password
  const [password, setPassword] = useState('')
  // State to store the strength label (e.g., Weak, Strong)
  const [strength, setStrength] = useState('')
  // State to store the CSS class for styling strength bar
  const [strengthClass, setStrengthClass] = useState('')
  // State to store tips for improving the password
  const [tips, setTips] = useState([])

  // Function to check the strength of a given password
  const checkStrength = (pass) => {
    // If no password entered, reset everything
    if (!pass) {
      setStrength('')
      setStrengthClass('')
      setTips([])
      return
    }

    // Array to hold tips for password improvement
    const newTips = []

    // Check if password has at least 8 characters
    const hasLength = pass.length >= 8
    newTips.push({ text: 'At least 8 characters', valid: hasLength })

    // Check if password has an uppercase letter
    const hasUpper = /[A-Z]/.test(pass)
    newTips.push({ text: 'Include at least one uppercase letter', valid: hasUpper })

    // Check if password has a lowercase letter
    const hasLower = /[a-z]/.test(pass)
    newTips.push({ text: 'Include at least one lowercase letter', valid: hasLower })

    // Check if password has a number
    const hasNumber = /[0-9]/.test(pass)
    newTips.push({ text: 'Include at least one number', valid: hasNumber })

    // Check if password has a special character
    const hasSpecial = /[^A-Za-z0-9]/.test(pass)
    newTips.push({ text: 'Include at least one special character (!@#$...)', valid: hasSpecial })

    // Count how many rules passed
    const rulesPassed = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

    // Default strength label and CSS class
    let label = 'Very Weak' // default label
    let cssClass = 'very-weak' // default CSS class

    // Decide strength based on rules passed
    if (rulesPassed === 5) {
      label = 'Very Strong'
      cssClass = 'very-strong'
    } else if (rulesPassed === 4) {
      label = 'Strong'
      cssClass = 'strong'
    } else if (rulesPassed === 3) {
      label = 'Weak'
      cssClass = 'weak'
    } else if (rulesPassed === 1 || rulesPassed === 2) {
      label = 'Very Weak'
      cssClass = 'very-weak'
    }

    // Update states with results
    setStrength(label)
    setStrengthClass(cssClass)
    setTips(newTips)
  }

  // Function to generate a random password
  const generatePassword = (length = 16) => {
    // Define character sets
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?'
    // Combine all characters
    const allChars = lowercase + uppercase + numbers + symbols

    // Build password by randomly picking characters
    let pass = ''
    for (let i = 0; i < length; i++) {
      pass += allChars[Math.floor(Math.random() * allChars.length)]
    }
    return pass
  }

  // Function to handle password generation
  const handleGenerate = () => {
    const newPass = generatePassword() // Generate new password
    setPassword(newPass) // Update password state
    checkStrength(newPass) // Check strength of new password
  }

  // Return JSX for rendering
  return (
    <div className="strength-checker"> {/* Container div */}
      <h2>Password Strength Checker</h2> {/* Title */}

      {/* Input field for password */}
      <input
        type="text"
        value={password}
        placeholder="Enter Password"
        onChange={(e) => {
          const value = e.target.value // Get input value
          setPassword(value) // Update password state
          checkStrength(value) // Check strength of entered password
        }}
      />

      {/* Button to generate random password */}
      <button onClick={handleGenerate}>Generate Password</button>

      {/* Show strength bar and label if password exists */}
      {password.length > 0 && strength && (
        <>
          <div className={`strength-bar ${strengthClass}`}></div> {/* Strength bar */}
          <p className={strengthClass}>
            Password strength: <strong>{strength}</strong> {/* Strength label */}
          </p>
        </>
      )}

      {/* Show tips if available */}
      {tips.length > 0 && (
        <div className="password-tips"> {/* Tips container */}
          <h4>Tips to improve your password:</h4>
          <ul>
            {tips.map((tip, index) => (
              <li
                key={index} // Unique key for each tip
                className={tip.valid ? 'tip-valid' : 'tip-invalid'} // Style based on validity
              >
                {tip.valid ? '✅' : '❌'} {tip.text} {/* Show check or cross with tip text */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Export PasswordChecker component
export default PasswordChecker
