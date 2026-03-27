import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnread = () => setUnreadCount(prev => prev + 1);
  
  const resetUnread = () => setUnreadCount(0);

  return (
    <ChatContext.Provider value={{ unreadCount, incrementUnread, resetUnread }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);