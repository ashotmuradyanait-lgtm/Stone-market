import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Սահմանում ենք, թե ինչ տվյալներ է պարունակելու Context-ը
interface ChatContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>; // Ավելացրեցի նաև սա, եթե պետք գա
  incrementUnread: () => void;
  resetUnread: () => void;
}

// 2. Ստեղծում ենք Context-ը (սկզբնական արժեքը null է, բայց նշում ենք տիպը)
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 3. Provider-ի համար սահմանում ենք children-ի տիպը
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const incrementUnread = () => setUnreadCount(prev => prev + 1);
  const resetUnread = () => setUnreadCount(0);

  return (
    <ChatContext.Provider value={{ unreadCount, setUnreadCount, incrementUnread, resetUnread }}>
      {children}
    </ChatContext.Provider>
  );
};

// 4. Custom Hook՝ սխալներից խուսափելու համար
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  
  // Եթե useChat-ը օգտագործվի ChatProvider-ից դուրս, TS-ը մեզ կզգուշացնի
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  
  return context;
};