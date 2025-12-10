import { useState } from 'react'
import '../styles/Passwordchecker.css';

const PasswordChecker = () => {
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState('')
  const [strengthClass, setStrengthClass] = useState('')
  const [tips, setTips] = useState([])

  const checkStrength = (pass) => {
    let score = 0
    const newTips = []

    // Length check
    const hasLength = pass.length >= 8
    if (hasLength) score++
    newTips.push({ text: 'At least 8 characters', valid: hasLength })

    // Uppercase
    const hasUpper = /[A-Z]/.test(pass)
    if (hasUpper) score++
    newTips.push({ text: 'Include at least one uppercase letter', valid: hasUpper })

    // Lowercase
    const hasLower = /[a-z]/.test(pass)
    if (hasLower) score++
    newTips.push({ text: 'Include at least one lowercase letter', valid: hasLower })

    // Number
    const hasNumber = /[0-9]/.test(pass)
    if (hasNumber) score++
    newTips.push({ text: 'Include at least one number', valid: hasNumber })

    // Special character
    const hasSpecial = /[^A-Za-z0-9]/.test(pass)
    if (hasSpecial) score++
    newTips.push({ text: 'Include at least one special character (!@#$...)', valid: hasSpecial })

    const strengthLabels = ['Very Weak', 'Weak', 'Acceptable', 'Strong', 'Very Strong']
    const strengthClasses = ['very-weak', 'weak', 'acceptable', 'strong', 'very-strong']

    setStrength(strengthLabels[score])
    setStrengthClass(strengthClasses[score])
    setTips(newTips)
  }

  const generatePassword = (length = 16) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?'
    const allChars = lowercase + uppercase + numbers + symbols
    let pass = ''
    for (let i = 0; i < length; i++) {
      pass += allChars[Math.floor(Math.random() * allChars.length)]
    }
    return pass
  }

  const handleGenerate = () => {
    const newPass = generatePassword()
    setPassword(newPass)
    checkStrength(newPass)
  }

  return (
    <div className="strength-checker">
      <h2>Password Strength Checker</h2>
      <input
        type="text"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          checkStrength(e.target.value)
        }}
        placeholder="Enter Password"
      />
      <button onClick={handleGenerate}>Generate Password</button>
      <div className={`strength-bar ${strengthClass}`}></div>
      <p className={strengthClass}>Password strength: {strength}</p>

      {tips.length > 0 && (
        <div className="password-tips">
          <h4>Tips to improve your password:</h4>
          <ul>
            {tips.map((tip, index) => (
              <li
                key={index}
                className={tip.valid ? 'tip-valid' : 'tip-invalid'}
              >
                {tip.valid ? '✅' : '❌'} {tip.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PasswordChecker
