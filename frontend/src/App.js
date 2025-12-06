//import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom'

//pages and components 
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import PasswordChecker from './components/Passwordchecker'
import Signup from './pages/Signup'
import Login from './pages/Login'
import AuthChoice from './pages/AuthChoice'
import SecurityQuiz from './pages/SecurityQuiz'
import UrlScanner from './components/UrlScanner';
import FeedbackForm from './pages/FeedbackForm';
import './styles/theme.css';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
  <Navbar />
  
  <div className="pages">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/passwordchecker" element={<PasswordChecker />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth" element={<AuthChoice />} />
      <Route path="/security-quiz" element={<SecurityQuiz />} />
      <Route path="/tools/url-scanner" element={<UrlScanner />} />
      <Route path="/feedback" element={<FeedbackForm />} />
    </Routes>
  </div>
</BrowserRouter>

    </div>
  );
}

export default App;
