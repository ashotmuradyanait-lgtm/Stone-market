import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, rtdb } from "../firebase/config";
import { 
  collection, query, onSnapshot, orderBy, 
  doc, updateDoc, addDoc, serverTimestamp, limit, where,
  DocumentData, QuerySnapshot, DocumentChange
} from "firebase/firestore";
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbTimestamp, DataSnapshot } from "firebase/database";
import { getChatId, markAsRead } from "../firebase/chat";
import { Send, Mic, Video, Menu, X, Phone, PhoneOff, User as UserIcon, Search, MoreVertical } from "lucide-react";
import { User } from "firebase/auth";

// --- TYPES & INTERFACES ---
interface IMessage {
  id: string;
  text: string;
  userId: string;
  email: string;
  type: "text" | "audio" | "video";
  createdAt: any;
}

interface IUserStatus {
  id: string;
  state: "online" | "offline";
  email: string;
  last_changed: any;
}

interface ICall {
  id: string;
  callerId: string;
  callerEmail: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  roomId: string;
}

interface ChatProps {
  user: User | null;
}

export default function Chat({ user }: ChatProps) {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [allStatuses, setAllStatuses] = useState<IUserStatus[]>([]);
  const [incomingCall, setIncomingCall] = useState<ICall | null>(null);
  const [text, setText] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const msgSound = useRef<HTMLAudioElement>(new Audio("/message-pop.mp3"));

  // 1. Ստատուսների կառավարում (RTDB)
  useEffect(() => {
    if (!user) return;
    const statusRef = ref(rtdb, `status/${user.uid}`);
    
    set(statusRef, { 
      state: "online", 
      email: user.email, 
      id: user.uid, 
      last_changed: rtdbTimestamp() 
    });

    onDisconnect(statusRef).set({ 
      state: "offline", 
      email: user.email, 
      id: user.uid, 
      last_changed: rtdbTimestamp() 
    });

    const allStatusRef = ref(rtdb, "status");
    return onValue(allStatusRef, (snap: DataSnapshot) => {
      if (snap.exists()) {
        const data = Object.entries(snap.val() as Record<string, any>).map(([id, val]) => ({
          id,
          ...val
        })) as IUserStatus[];
        setAllStatuses(data);
      }
    });
  }, [user]);

  // 2. Նամակների լսող (Firestore)
  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as IMessage));
      setMessages(docs);
      markAsRead(chatId, docs as any, user.uid);
      
      // Ձայնային ազդանշան
      if (!snapshot.metadata.hasPendingWrites) {
        snapshot.docChanges().forEach((change: DocumentChange<DocumentData>) => {
          if (change.type === "added" && change.doc.data().userId !== user.uid) {
            msgSound.current.play().catch(() => {});
          }
        });
      }
    });
    return () => unsubscribe();
  }, [chatId, user]);

  const handleSend = async (): Promise<void> => {
    if (!text.trim() || !chatId || !user) return;
    const tempText = text;
    setText(""); 
    
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: tempText,
        userId: user.uid,
        email: user.email,
        type: "text",
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Loading State
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-gray-800 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 shadow-2xl transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Messenger</h1>
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input placeholder="Փնտրել..." className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"/>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          {allStatuses.filter(s => s.id !== user.uid).map(s => (
            <div 
              key={s.id} 
              onClick={() => { navigate(`/chat/${getChatId(user.uid, s.id)}`); setIsSidebarOpen(false); }}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${getChatId(user.uid, s.id) === chatId ? "bg-indigo-50 shadow-sm" : "hover:bg-gray-50"}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {s.email ? s.email[0].toUpperCase() : <UserIcon size={20}/>}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${s.state === "online" ? "bg-green-500" : "bg-gray-300"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{s.email}</p>
                <p className={`text-xs ${s.state === "online" ? "text-green-500" : "text-gray-400"}`}>
                  {s.state === "online" ? "Ակտիվ է" : "Անցանց"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:m-4 lg:rounded-[2.5rem] lg:shadow-xl border border-gray-100 overflow-hidden relative">
        {chatId ? (
          <>
            <header className="h-20 flex items-center justify-between px-8 border-b border-gray-50 bg-white/80 backdrop-blur-md z-20">
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setIsSidebarOpen(true)}><Menu/></button>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {messages[0]?.email?.[0].toUpperCase() || "!"}
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-900">Անձնական Զրույց</h2>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Միացված է
                  </div>
                </div>
              </div>
              <button onClick={() => navigate(`/video-call/${chatId}`)} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl border border-indigo-50 transition-all"><Video size={22}/></button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfdfe] custom-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.userId === user.uid ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] lg:max-w-[60%]`}>
                    <div className={`p-4 rounded-3xl shadow-sm text-[15px] ${
                      m.userId === user.uid 
                      ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none" 
                      : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                    }`}>
                      {m.text}
                      <div className={`text-[10px] mt-2 flex justify-end opacity-70 ${m.userId === user.uid ? "text-indigo-100" : "text-gray-400"}`}>
                        {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer className="p-6 bg-white border-t border-gray-50">
              <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 p-2 pl-4 rounded-[1.5rem] border border-gray-100 focus-within:bg-white focus-within:shadow-lg transition-all">
                <button className="p-3 text-gray-400 hover:text-indigo-600"><Mic size={22}/></button>
                <input 
                  value={text} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSend()}
                  placeholder="Գրեք նամակ..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] outline-none py-3"
                />
                <button 
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className={`p-4 rounded-2xl transition-all ${text.trim() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-200 text-white"}`}
                >
                  <Send size={20}/>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-50">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mb-6">
              <Send size={40} className="text-indigo-500 -rotate-12" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Ընտրեք զրուցակից</h2>
            <p className="text-gray-500 max-w-xs text-sm mt-2">Սկսեք նոր զրույց ընտրելով օգտատերերից մեկին ձախ կողմում:</p>
          </div>
        )}
      </main>

      {/* --- CSS --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
}