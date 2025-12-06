import { useState } from 'react'
import '../styles/Passwordchecker.css';

const PasswordChecker = () => {
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState('')
  const [strengthClass, setStrengthClass] = useState('')

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[a-z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    const strengthLabels = ['Very Weak', 'Weak', 'Acceptable', 'Strong', 'Very Strong']
    const strengthClasses = ['very-weak', 'weak', 'acceptable', 'strong', 'very-strong']
    
    setStrength(strengthLabels[score])
    setStrengthClass(strengthClasses[score])
  }

  const generatePassword = (length = 12) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;

    let pass = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      pass += allChars[randomIndex];
    }

    return pass;
  }

  const handleGenerate = () => {
    const newPass = generatePassword(16); // you can change length here
    setPassword(newPass);
    checkStrength(newPass);
  }

  return (
    <div className="strength-checker">
      <h2>Password Strength Checker</h2>
      <input
        type="text"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          checkStrength(e.target.value);
        }}
        placeholder="Enter Password"
      />
      <button onClick={handleGenerate}>Generate Password</button>
      <div className={`strength-bar ${strengthClass}`}></div>
      <p className={strengthClass}>Password strength: {strength}</p>
    </div>
  )
}

export default PasswordChecker
