import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isLoading } = useLogin()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)

    // Redirect only if no error
    const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        navigate('/')
    }
  }
  return (
     <div className="login-container">
      <form className="login" onSubmit={handleSubmit}>
        <h3>Login</h3>

        <label>Email:</label>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="input-field"
        />
        
        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="input-field"
        />
        
        <button disabled={isLoading} className="login-btn">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}

export default Login
