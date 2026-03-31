import { useEffect, useState, useRef } from "react";
import { 
  listenMessages, 
  sendMessage, 
  updateUserStatus, 
  listenAllStatuses, 
  getChatId, 
  markAsRead 
} from "../firebase/chat";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom"; 
import { ref, onValue } from "firebase/database";

export default function Chat() {
  const { chatId } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ավելացրել ենք loading ստատուս
  const [messages, setMessages] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  // 1. Auth ստուգում (Սա թույլ չի տա, որ refresh-ից հետո user-ը կորի)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) updateUserStatus(u.uid, u.email);
    });
    const unsubStatus = listenAllStatuses((list) => setAllStatuses(list));
    return () => { unsubAuth(); unsubStatus(); };
  }, []);

  // 2. Նամակների լսում (Միայն երբ user-ը կա)
  useEffect(() => {
    if (!chatId || !user) return;
    
    const unsubMsg = listenMessages(chatId, user.uid, (newMsgs) => {
      setMessages(newMsgs);
      markAsRead(chatId, newMsgs, user.uid);
    });

    // Զրուցակցի տվյալները
    const otherId = chatId.split("_").find(id => id !== user.uid);
    if (otherId) {
      onValue(ref(db, `status/${otherId}`), (s) => setActiveChatUser(s.val()));
    }

    return () => unsubMsg();
  }, [chatId, user]);

  // Ավտոմատ Scroll ներքև
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !chatId || !user) return;
    await sendMessage(chatId, { 
      text: text.trim(), 
      userId: user.uid, 
      email: user.email,
      createdAt: Date.now()
    });
    setText("");
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600">Բեռնվում է...</div>;

  return (
    <div className="flex h-[95vh] max-w-7xl mx-auto my-2 bg-slate-50 shadow-2xl rounded-3xl overflow-hidden font-sans border border-white/20">
      
      {/* SIDEBAR (Ձախ մաս) */}
      <div className="w-20 md:w-80 bg-white border-r border-gray-100 flex flex-col shadow-inner">
        <div className="p-6 border-b">
          <h2 className="hidden md:block text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-tight">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {allStatuses.map((s) => {
            if (s.id === user?.uid) return null;
            const cId = getChatId(user.uid, s.id);
            const isActive = chatId === cId;
            return (
              <div key={s.id} onClick={() => navigate(`/chat/${cId}`)}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isActive ? "bg-indigo-600 text-white shadow-lg scale-95" : "hover:bg-indigo-50 text-gray-700"
                }`}>
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${isActive ? "bg-white/20" : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"}`}>
                    {s.email[0].toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isActive ? "border-indigo-600" : "border-white"} ${s.state === "online" ? "bg-green-400" : "bg-gray-300"}`}></span>
                </div>
                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-bold truncate">{s.email.split('@')[0]}</p>
                  <p className={`text-[10px] font-medium uppercase ${isActive ? "text-indigo-100" : "text-gray-400"}`}>{s.state}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT AREA (Աջ մաս) */}
      <div className="flex-1 flex flex-col relative">
        {chatId ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-b flex items-center justify-between shadow-sm z-10 sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  {activeChatUser?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 leading-none">{activeChatUser?.email?.split('@')[0]}</h3>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{activeChatUser?.state}</span>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((msg) => {
                const isMe = msg.userId === user?.uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-1 duration-300`}>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                      isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <span className={`text-[9px] block mt-1 text-right opacity-60 ${isMe ? "text-white" : "text-gray-400"}`}>
                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="max-w-4xl mx-auto flex items-center gap-2 bg-gray-100 p-2 rounded-2xl border border-transparent focus-within:bg-white focus-within:border-indigo-300 transition-all shadow-inner">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Գրեք նամակ..."
                  className="flex-1 bg-transparent p-2 outline-none text-sm text-gray-800"
                />
                <button 
                  onClick={handleSend} 
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all shadow-indigo-200"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-300">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-gray-200">
                <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
             </div>
             <p className="font-semibold text-gray-400">Ընտրեք զրուցակից՝ սկսելու համար</p>
          </div>
        )}
      </div>
    </div>
  );
}