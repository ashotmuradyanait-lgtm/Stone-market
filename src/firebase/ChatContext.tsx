import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';

// 1. Սահմանում ենք տիպերը
interface ChatContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  incrementUnread: () => void;
  resetUnread: () => void;
}

// 2. Ստեղծում ենք Context-ը (սկզբնական արժեքը null, բայց տիպը նշված է)
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 3. Provider-ը
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const incrementUnread = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  const resetUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Այստեղ օգտագործում ենք "as ChatContextType", որ TS-ը չբողոքի
  const value = useMemo(() => ({
    unreadCount,
    setUnreadCount,
    incrementUnread,
    resetUnread
  }), [unreadCount, incrementUnread, resetUnread]) as ChatContextType;

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// 4. Custom Hook
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};