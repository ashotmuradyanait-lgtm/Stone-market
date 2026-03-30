import { useEffect, useState, useRef } from "react";
import { listenMessages, sendMessage, updateUserStatus, listenAllStatuses } from "../firebase/chat";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useParams } from "react-router-dom"; 
import { ref, onValue, update, get } from "firebase/database"; // Ավելացվեց update և get

export default function Chat() {
  const { chatId } = useParams(); 
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const scrollRef = useRef(null);

  // --- ՆՈՐ ՖՈՒՆԿՑԻԱ. Նամակները նշել որպես կարդացված ---
  const markAsRead = async (currentMsgs, currentUser) => {
    if (!currentUser || currentMsgs.length === 0) return;

    const chatPath = chatId ? `private_chats/${chatId}` : "messages";
    const updates = {};
    let hasUpdates = false;

    currentMsgs.forEach((msg) => {
      // Եթե նամակը իմը չէ (receiver-ը ես եմ) և կարգավիճակը դեռ "unread" է
      // (Կամ եթե private chat է, ստուգում ենք՝ արդյոք ես եմ ստացողը)
      const isIncoming = msg.userId !== currentUser.uid;
      if (isIncoming && msg.status === "unread") {
        updates[`${chatPath}/${msg.id}/status`] = "read";
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      const dbRef = ref(db);
      await update(dbRef, updates);
    }
  };

  // 1. Օգտատիրոջ մուտքի և բոլորի ստատուսների վերահսկում
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
      const sorted = statusList.sort((a, b) => (a.state === "online" ? -1 : 1));
      setAllStatuses(sorted);
    });

    return () => {
      unsubAuth();
      unsubStatus();
    };
  }, []);

  // 2. Ակտիվ զրուցակցի տվյալները բեռնելը
  useEffect(() => {
    if (chatId && user) {
      const otherUserId = chatId.split("_").find(id => id !== user.uid);
      
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

  // 3. Հաղորդագրությունների լսում
  useEffect(() => {
    const chatPath = chatId ? `private_chats/${chatId}` : "messages";
    
    setLoading(true);
    setMessages([]); 

    const unsubMsg = listenMessages(chatPath, (newMessages) => {
      const sortedMsgs = newMessages.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(sortedMsgs);
      setLoading(false);
      
      // Հենց նոր նամակներ են գալիս, փորձում ենք նշել որպես կարդացված
      if (user) {
        markAsRead(sortedMsgs, user);
      }
    });

    return () => unsubMsg();
  }, [chatId, user]); // Ավելացրինք user-ը այստեղ

  // Ավտոմատ scroll դեպի վերջին նամակը
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
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
      status: "unread", // Ավելացնում ենք ստատուսը ուղարկելիս
      createdAt: Date.now()
    });
    
    setText("");
  };

  return (
    <div className="flex h-screen max-w-6xl mx-auto bg-white shadow-2xl overflow-hidden border-x border-gray-200 font-sans">
      
      {/* --- SIDEBAR --- */}
      <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-5 border-b bg-white flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 italic uppercase tracking-tighter">Stone Chat</h3>
          <Link to="/chat" className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-black hover:bg-indigo-200 transition-all">GLOBAL</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allStatuses.map((status) => {
            if (status.id === user?.uid) return null;
            
            const combinedId = user ? [user.uid, status.id].sort().join("_") : null;

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
                  <p className="text-[10px] font-medium opacity-70">{status.state}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-lg font-black text-gray-800 leading-none">
              {chatId ? (activeChatUser?.displayName || activeChatUser?.email?.split('@')[0] || "Private Chat") : "Global Channel"}
            </h2>
            {chatId && activeChatUser && (
              <span className={`text-[10px] font-bold uppercase tracking-widest ${activeChatUser.state === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                {activeChatUser.state}
              </span>
            )}
          </div>
          <Link to="/" className="text-gray-500 hover:text-indigo-600 transition-all">
             <i className="fa fa-home text-xl"></i>
          </Link>
        </div>

        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-fixed"
        >
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm italic">Բեռնվում է...</div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm italic">Հաղորդագրություններ չկան:</div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.userId === user?.uid;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                    isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  }`}>
                    {!isMe && !chatId && (
                      <span className="text-[10px] font-black mb-1 text-indigo-500 uppercase block">
                        {msg.displayName}
                      </span>
                    )}
                    <p className="text-sm font-medium">{msg.text}</p>
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
            placeholder={chatId ? "Գրել անձնական..." : "Գրել բոլորին..."}
            className="flex-1 p-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!text.trim() || !user}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-2xl transition-all active:scale-95 disabled:opacity-50 shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current rotate-45"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}