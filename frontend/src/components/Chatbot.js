// Import React hooks: useState for state, useEffect for lifecycle, useCallback for memoized functions, useRef for DOM refs
import { useState, useEffect, useCallback, useRef } from 'react';
// Import axios library for making HTTP requests
import axios from 'axios';
// Import CSS file for chatbot styling
import '../styles/Chatbot.css';
// Import custom hook to get authentication context (user info and token)
import { useAuthContext } from '../hooks/useAuthContext';
// Import navigation hook from React Router for page redirects
import { useNavigate } from 'react-router-dom';

// Define backend API base URL
const BACKEND_URL = "https://project1-3-ow0y.onrender.com/api";

// Define Chatbot component
const Chatbot = () => {
  // State for user input text
  const [userInput, setUserInput] = useState('');
  // State for chat messages (when no conversation is selected)
  const [chatMessages, setChatMessages] = useState([]);
  // State for all conversations fetched from backend
  const [conversations, setConversations] = useState([]);
  // State for currently selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  // Ref to scroll messages to the bottom
  const messagesEndRef = useRef(null);

  // Get logged-in user from AuthContext
  const { user } = useAuthContext();
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // State to check if AuthContext is ready
  const [authChecked, setAuthChecked] = useState(false); // Wait for AuthContext

  // useEffect runs after first render to mark AuthContext as ready
  useEffect(() => {
    setAuthChecked(true);
  }, []);

  // Function to fetch all conversations from backend
  const viewConversations = useCallback(async () => {
    // If no user token, skip
    if (!user?.token) return;

    try {
      // Send GET request to backend with Authorization header
      const res = await axios.get(`${BACKEND_URL}/chat`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Save conversations in state
      setConversations(res.data);
    } catch (err) {
      // Log error if request fails
      console.error('Failed to fetch history:', err);
    }
  }, [user?.token]); // Depend on user token

  // Scroll to bottom whenever selectedConversation or chatMessages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedConversation, chatMessages]);

  // Redirect to /auth if not logged in, otherwise fetch conversations
  useEffect(() => {
    // Wait until AuthContext is ready
    if (!authChecked) return;

    // If no user, redirect
    if (!user) {
      navigate('/auth');
    } else {
      // If user exists, fetch conversations
      viewConversations();
    }
  }, [authChecked, user, navigate, viewConversations]);

  // If auth not checked yet, render nothing
  if (!authChecked) return null;
  // If no user logged in, render nothing
  if (!user) return null;

  // Function to send a message
  const sendMessage = async () => {
    // Skip if input is empty
    if (userInput.trim() === '') return;

    try {
      // If a conversation is selected, append message
      if (selectedConversation) {
        const response = await axios.patch(
          `${BACKEND_URL}/chat/${selectedConversation._id}`,
          { message: userInput },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        // Update selected conversation with new data
        setSelectedConversation(response.data);
      } else {
        // Otherwise create a new conversation
        const response = await axios.post(
          `${BACKEND_URL}/chat`,
          { message: userInput },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        // Build new conversation object
        const newConversation = {
          _id: response.data.conversationId,
          topic: response.data.userMessage,
          messages: [
            { text: response.data.userMessage, isUser: true },
            { text: response.data.botResponse, isUser: false }
          ]
        };

        // Set new conversation as selected
        setSelectedConversation(newConversation);
        // Refresh conversation list
        viewConversations();
      }
    } catch (error) {
      // Log error if sending fails
      console.error('Error sending message', error);
    }

    // Clear input field
    setUserInput('');
  };

  // Function to group conversations by date
  const groupConversationsByDate = (convos) => {
    const groups = {}; // Object to hold groups
    convos.forEach((chat) => {
      const date = new Date(chat.createdAt); // Get date of conversation
      const today = new Date(); // Get today’s date
      // Label as "Today" if same date, otherwise weekday name
      const label =
        date.toDateString() === today.toDateString()
          ? 'Today'
          : date.toLocaleDateString('en-US', { weekday: 'long' });
      // If group doesn’t exist, create it
      if (!groups[label]) groups[label] = [];
      // Add chat to group
      groups[label].push(chat);
    });
    return groups; // Return grouped conversations
  };

  // Function to delete a conversation
  const deleteConversation = async (id) => {
    if (!id) return; // Skip if no id
    try {
      // Send DELETE request to backend
      await axios.delete(`${BACKEND_URL}/chat/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Refresh conversation list
      viewConversations();
      // Clear selected conversation
      setSelectedConversation(null);
      // Clear chat messages
      setChatMessages([]);
    } catch (error) {
      // Log error if deletion fails
      console.error('Error deleting conversation', error);
    }
  };

  // Function to start a new conversation
  const startNewConversation = () => {
    setSelectedConversation(null); // Clear selected conversation
    setChatMessages([]); // Clear messages
    setUserInput(''); // Clear input
  };

  // Return JSX for rendering
  return (
    <div className="chatbot">
      {/* Sidebar with past conversations */}
      <div className="chat-history">
        {/* Button to start new conversation */}
        <span className="new-convo-icon" onClick={startNewConversation}>＋</span>
        <h3>Past Conversations</h3>
        {/* Loop through grouped conversations */}
        {Object.entries(groupConversationsByDate(conversations)).map(([label, chats]) => (
          <div key={label}>
            <h4>{label}</h4>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => setSelectedConversation(chat)} // Select conversation
                  className={selectedConversation?._id === chat._id ? 'selected' : ''}
                >
                  <strong>{chat.topic || 'Untitled'}</strong>
                  <div className="timestamp">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </div>
                  {/* Delete button */}
                  <span
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting conversation
                      deleteConversation(chat._id); // Delete conversation
                    }}
                  >✖</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Chat Window */}
      <div className="chat-window">
        <div className="messages">
          {/* Show messages from selected conversation or temporary chatMessages */}
          {(selectedConversation ? selectedConversation.messages : chatMessages).map((msg, index) => (
            <div key={index} className={msg.isUser ? 'user' : 'bot'}>
              {msg.text}
            </div>
          ))}
          {/* Empty div used to scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area for typing messages */}
        <div className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} // Update input state
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage(); // Send message on Enter
              }
            }}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

// Export Chatbot component
export default Chatbot;
