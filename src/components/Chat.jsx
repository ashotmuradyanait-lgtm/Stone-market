import { useEffect, useState, useRef, useCallback } from "react";
import { listenMessages, sendMessage, updateUserStatus, listenAllStatuses } from "../firebase/chat";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useParams } from "react-router-dom"; 
import { ref, onValue, update } from "firebase/database";

export default function Chat() {
  const { chatId } = useParams(); 
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef(null);

  // --- Օգնող ֆունկցիա ID-ների համար ---
  const getCorrectChatId = useCallback((id1, id2) => {
    return [id1, id2].sort().join("_");
  }, []);

  // --- Նամակները նշել որպես կարդացված ---
  const markAsRead = async (currentMsgs, currentUser) => {
    if (!currentUser || !currentMsgs.length || !chatId) return;

    const updates = {};
    let hasUpdates = false;

    currentMsgs.forEach((msg) => {
      // Եթե նամակը իմը չէ և "unread" է
      if (msg.userId !== currentUser.uid && msg.status === "unread") {
        updates[`private_chats/${chatId}/${msg.id}/status`] = "read";
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      try {
        await update(ref(db), updates);
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  // 1. Auth և Բոլորի ստատուսները
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        updateUserStatus(u.uid, u.email);
      } else {
        setUser(null);
      }
    });

    const unsubStatus = listenAllStatuses((statusList) => {
      setAllStatuses(statusList.sort((a, b) => (a.state === "online" ? -1 : 1)));
    });

    return () => {
      unsubAuth();
      unsubStatus();
    };
  }, []);

  // 2. Ակտիվ զրուցակցի տվյալները (Private Chat-ի համար)
  useEffect(() => {
    if (chatId && user) {
      const parts = chatId.split("_");
      const otherUserId = parts.find(id => id !== user.uid);
      
      if (otherUserId) {
        const userRef = ref(db, `status/${otherUserId}`);
        const unsub = onValue(userRef, (snapshot) => {
          setActiveChatUser(snapshot.val());
        });
        return () => unsub();
      }
    } else {
      setActiveChatUser(null);
    }
  }, [chatId, user]);

  // 3. Հաղորդագրությունների լսում (Real-time)
  useEffect(() => {
    const chatPath = chatId ? `private_chats/${chatId}` : "messages";
    
    setLoading(true);
    const unsubMsg = listenMessages(chatPath, (newMessages) => {
      const sortedMsgs = [...newMessages].sort((a, b) => a.createdAt - b.createdAt);
      setMessages(sortedMsgs);
      setLoading(false);
      
      if (user && chatId) {
        markAsRead(sortedMsgs, user);
      }
    });

    return () => unsubMsg();
  }, [chatId, user]);

  // Scroll դեպի վերջ
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !user) return;

    const chatPath = chatId ? `private_chats/${chatId}` : "messages";

    sendMessage(chatPath, { 
      text: text.trim(), 
      userId: user.uid, 
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      status: "unread",
      createdAt: Date.now()
    });
    
    setText("");
  };

  return (
    <div className="flex h-screen max-w-6xl mx-auto bg-white shadow-2xl overflow-hidden border-x border-gray-200 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-5 border-b bg-white flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 tracking-tighter">STONE MARKET</h3>
          <Link to="/chat" className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-black">GLOBAL</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allStatuses.map((status) => {
            if (status.id === user?.uid) return null;
            
            // Ստեղծում ենք ճիշտ սորտավորված ID
            const combinedId = user ? getCorrectChatId(user.uid, status.id) : null;

            return (
              <Link 
                to={`/chat/${combinedId}`} 
                key={status.id} 
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    chatId === combinedId ? "bg-indigo-600 text-white shadow-lg" : "hover:bg-indigo-50 text-gray-700"
                }`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${chatId === combinedId ? "border-white bg-indigo-500" : "border-indigo-200 bg-white text-indigo-600"}`}>
                    {status.email ? status.email[0].toUpperCase() : "?"}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${status.state === "online" ? "bg-green-400" : "bg-gray-300"}`}></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold truncate">{status.displayName || status.email?.split('@')[0]}</p>
                  <p className="text-[10px] opacity-70">{status.state}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 bg-white border-b flex justify-between items-center z-10">
          <div>
            <h2 className="text-lg font-black text-gray-800">
              {chatId ? (activeChatUser?.displayName || activeChatUser?.email?.split('@')[0] || "Մասնավոր զրույց") : "Global chat"}
            </h2>
            {chatId && activeChatUser && (
              <span className={`text-[10px] font-bold uppercase ${activeChatUser.state === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                • {activeChatUser.state}
              </span>
            )}
          </div>
          <Link to="/" className="text-gray-400 hover:text-indigo-600">
             Global
          </Link>
        </div>

        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          style={{backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')`}}
        >
          {loading ? (
            <div className="text-center text-gray-400 mt-10">Loading</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.userId === user?.uid;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                    isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  }`}>
                    {!isMe && !chatId && (
                      <span className="text-[10px] font-black text-indigo-500 block mb-1">{msg.displayName}</span>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    {isMe && chatId && (
                       <span className="text-[9px] block text-right opacity-70 mt-1">
                         {msg.status === "read" ? "✓✓" : "✓"}
                       </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-white border-t flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send message"
            className="flex-1 p-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            onClick={handleSend}
            disabled={!text.trim() || !user}
            className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}