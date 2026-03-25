import { useEffect, useState, useRef } from "react";
import { listenMessages, sendMessage, updateUserStatus, listenAllStatuses } from "../firebase/chat";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]); // Բոլոր օգտատերերի ստատուսները
  const [text, setText] = useState("");
  
  const scrollRef = useRef(null);
  const notificationAudio = useRef(new Audio("/notify.mp3"));

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Հիմա ուղարկում ենք և՛ ID-ն, և՛ Email-ը, որ բոլորը տեսնեն
        updateUserStatus(u.uid, u.email);
      }
    });

    // Լսում ենք բոլոր օգտատերերի ստատուսները Sidebar-ի համար
    const unsubStatus = listenAllStatuses((statusList) => {
      // Սորտավորում ենք. Online-ները վերևում, Offline-ները ներքևում
      const sorted = statusList.sort((a, b) => (a.state === "online" ? -1 : 1));
      setAllStatuses(sorted);
    });

    const unsubMsg = listenMessages((newMessages) => {
      setMessages((prevMessages) => {
        if (prevMessages.length > 0 && newMessages.length > prevMessages.length) {
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.userId !== auth.currentUser?.uid) {
            notificationAudio.current.play().catch(() => {});
          }
        }
        return newMessages;
      });
    });

    return () => {
      unsubAuth();
      unsubMsg();
      unsubStatus();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ text, userId: user?.uid, email: user?.email });
    setText("");
  };

  return (
    <div className="flex h-screen max-w-6xl mx-auto bg-white shadow-2xl overflow-hidden border-x border-gray-200 font-sans">
      
      {/* --- SIDEBAR: Users List --- */}
      <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-5 border-b bg-white">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            👥 Users <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{allStatuses.length}</span>
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allStatuses.map((status) => (
            <div key={status.id} className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-gray-100 transition-hover hover:bg-gray-100">
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {status.email ? status.email[0].toUpperCase() : "?"}
                </div>
                {/* Dynamic Status Dot */}
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  status.state === "online" ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}></span>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{status.email?.split('@')[0]}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{status.state}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-black text-indigo-600 tracking-tighter uppercase">Stone Chat</h2>
          {user && (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
               <span className="text-xs font-bold text-indigo-600 truncate max-w-[150px] italic">
                {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Messages List */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
        >
          {messages.map((msg) => {
            const isMe = msg.userId === user?.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                  isMe 
                    ? "bg-indigo-600 text-white rounded-br-none" 
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                }`}>
                  {!isMe && (
                    <p className="text-[10px] font-black mb-1 text-indigo-500 uppercase">
                      {msg.email?.split('@')[0]}
                    </p>
                  )}
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t flex gap-2 items-center">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all text-sm border-none shadow-inner"
          />
          <button 
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-50"
            disabled={!text.trim()}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}