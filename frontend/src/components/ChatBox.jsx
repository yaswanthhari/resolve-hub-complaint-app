import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';

const ChatBox = ({ complaintId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${complaintId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    // Setup Socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinComplaint', complaintId);

    newSocket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [complaintId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const msgData = {
        complaintId,
        content: newMessage,
        senderModel: user.role === 'user' ? 'User' : 'User' // Based on current schema, both are Users
      };
      
      const res = await api.post('/messages', msgData);
      socket.emit('sendMessage', res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl h-full flex flex-col shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="p-6 border-b border-white/5 z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Live Support</h3>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Agent is online
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar z-10">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="bg-dark/50 p-6 rounded-2xl border border-white/5">
              <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <p className="text-gray-400 font-medium">No messages yet.</p>
              <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId?._id === user.id || msg.senderId === user.id;
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{animationDelay: `${Math.min(index * 50, 500)}ms`}}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                  isMe 
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-sm border border-primary/20' 
                    : 'bg-dark/80 text-gray-200 rounded-tl-sm border border-white/5'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">
                    {isMe ? 'You' : (msg.senderId?.name || 'Agent')}
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <div className="text-[10px] mt-2 opacity-50 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-dark/30 border-t border-white/5 z-10">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-dark/80 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-secondary hover:bg-secondary/90 text-dark rounded-2xl px-5 py-3.5 flex items-center justify-center transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(3,218,198,0.3)]"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
