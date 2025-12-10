import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

// Full deployed backend URL including /api
const BACKEND_URL = "https://project1-3-ow0y.onrender.com/api";

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messagesEndRef = useRef(null);

  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Fetch all conversations
  const viewConversations = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/chat`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [user?.token]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedConversation, chatMessages]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      viewConversations();
    }
  }, [user, navigate, viewConversations]);

  if (!user) return null;

  // Send message
  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const messageToSend = userInput;
    setUserInput(''); // Clear input immediately

    try {
      if (selectedConversation) {
        // Append to existing conversation
        const response = await axios.patch(
          `${BACKEND_URL}/chat/${selectedConversation._id}`,
          { message: messageToSend },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setSelectedConversation(prev => ({
          ...prev,
          messages: [
            ...prev.messages,
            { text: messageToSend, isUser: true },
            { text: response.data.botResponse, isUser: false },
          ],
        }));

        setChatMessages(prev => [
          ...prev,
          { text: messageToSend, isUser: true },
          { text: response.data.botResponse, isUser: false },
        ]);
      } else {
        // Create new conversation
        const response = await axios.post(
          `${BACKEND_URL}/chat`,
          { message: messageToSend },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        const newConversation = {
          _id: response.data.conversationId || Date.now().toString(),
          topic: response.data.userMessage,
          messages: [
            { text: response.data.userMessage, isUser: true },
            { text: response.data.botResponse, isUser: false },
          ],
        };

        setSelectedConversation(newConversation);
        setChatMessages(newConversation.messages);

        viewConversations(); // Refresh conversation list
      }
    } catch (error) {
      console.error('Error sending message', error);
      alert('Failed to send message. Please check your connection or login status.');
    }
  };

  // Group conversations by date
  const groupConversationsByDate = (convos) => {
    const groups = {};
    convos.forEach((chat) => {
      const date = new Date(chat.createdAt);
      const today = new Date();
      const label =
        date.toDateString() === today.toDateString()
          ? 'Today'
          : date.toLocaleDateString('en-US', { weekday: 'long' });

      if (!groups[label]) groups[label] = [];
      groups[label].push(chat);
    });
    return groups;
  };

  // Delete conversation
  const deleteConversation = async (id) => {
    if (!id) return;
    try {
      await axios.delete(`${BACKEND_URL}/chat/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      viewConversations();
      setSelectedConversation(null);
      setChatMessages([]);
    } catch (error) {
      console.error('Error deleting conversation', error);
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setSelectedConversation(null);
    setChatMessages([]);
    setUserInput('');
  };

  return (
    <div className="chatbot">
      {/* Sidebar */}
      <div className="chat-history">
        <span className="new-convo-icon" onClick={startNewConversation}>
          ＋
        </span>

        <h3>Past Conversations</h3>
        {Object.entries(groupConversationsByDate(conversations)).map(([label, chats]) => (
          <div key={label}>
            <h4>{label}</h4>
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => {
                    setSelectedConversation(chat);
                    setChatMessages(chat.messages || []);
                  }}
                  className={selectedConversation?._id === chat._id ? 'selected' : ''}
                >
                  <strong>{chat.topic || 'Untitled'}</strong>
                  <div className="timestamp">
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </div>

                  <span
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(chat._id);
                    }}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={msg.isUser ? 'user' : 'bot'}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
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

export default Chatbot;
