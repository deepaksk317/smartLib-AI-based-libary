import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../api';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputMessage);
      const aiMessage = {
        id: response.data.message_id,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>AI Library Assistant</h3>
        <button
          className="btn btn-secondary"
          onClick={clearChat}
          style={{ padding: '5px 10px', fontSize: '14px' }}
        >
          Clear Chat
        </button>
      </div>
      
      <div
        style={{
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '15px',
          marginBottom: '15px',
          overflowY: 'auto',
          backgroundColor: '#f9f9f9'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
            <p>Welcome! I'm your AI library assistant. Ask me about books, recommendations, or anything library-related!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: message.type === 'user' ? '#007bff' : '#e9ecef',
                  color: message.type === 'user' ? 'white' : '#333',
                  wordWrap: 'break-word'
                }}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
                <div
                  style={{
                    fontSize: '12px',
                    opacity: 0.7,
                    marginTop: '5px'
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            AI is thinking...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask me anything about books or the library..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !inputMessage.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
