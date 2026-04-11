import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, rtdb } from "../firebase/config";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  collection, query, onSnapshot, orderBy, 
  addDoc, serverTimestamp, DocumentData, QuerySnapshot 
} from "firebase/firestore";
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbTimestamp, off } from "firebase/database";
import { getChatId, markAsRead } from "../firebase/chat";
import { Send, Mic, Video, Menu, X, Search, StopCircle } from "lucide-react";
import { User } from "firebase/auth";

// --- TYPES & INTERFACES ---
interface IMessage {
  id: string;
  text?: string;
  userId: string;
  email: string;
  type: "text" | "audio" | "video";
  audioUrl?: string;
  createdAt: any;
}

interface IUser {
  uid: string;
  email: string;
  photoURL?: string;
  state?: "online" | "offline";
}

export default function Chat({ user }: { user: User | null }) {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const storage = getStorage();
  
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [text, setText] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const msgSound = useRef(new Audio("/message-pop.mp3"));
  
  // Հիշում ենք նախորդ նամակների քանակը ձայնի համար
  const prevMsgCount = useRef<number>(0);

  // 1. Sync User Status & Fetch Users List
  useEffect(() => {
    if (!user) return;

    const statusRef = ref(rtdb, `status/${user.uid}`);
    set(statusRef, { state: "online", email: user.email, id: user.uid, last_changed: rtdbTimestamp() });
    onDisconnect(statusRef).set({ state: "offline", email: user.email, id: user.uid, last_changed: rtdbTimestamp() });

    const usersQuery = query(collection(db, "users"));
    const statusRefAll = ref(rtdb, "status");

    const unsubUsers = onSnapshot(usersQuery, (snap) => {
      const usersData = snap.docs.map(doc => doc.data() as IUser).filter(u => u.uid !== user.uid);
      
      onValue(statusRefAll, (statusSnap) => {
        const statuses = statusSnap.val() || {};
        const mergedUsers = usersData.map(u => ({
          ...u,
          state: statuses[u.uid]?.state || "offline"
        }));
        setUsers(mergedUsers);
      });
    });

    return () => {
      unsubUsers();
      off(statusRefAll); // Cleanup RTDB listener
    };
  }, [user]);

  // 2. Real-time Messages Listener
  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as IMessage));
      
      // Ձայնային ազդանշանի տրամաբանությունը
      if (docs.length > prevMsgCount.current) {
        const lastMsg = docs[docs.length - 1];
        // Չխաղալ ձայնը, եթե նամակը մերն է կամ եթե այն նոր է վերբեռնվում (pending writes)
        if (lastMsg && lastMsg.userId !== user.uid && !snapshot.metadata.hasPendingWrites) {
          msgSound.current.play().catch(() => {});
        }
      }

      setMessages(docs);
      prevMsgCount.current = docs.length;
      markAsRead(chatId, docs as any, user.uid);
    });

    return () => unsubscribe();
  }, [chatId, user]);

  // 3. Send Text Message
  const handleSend = async () => {
    if (!text.trim() || !chatId || !user) return;
    const mText = text;
    setText("");
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: mText,
        userId: user.uid,
        email: user.email,
        type: "text",
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending text:", err);
    }
  };

  // 4. Voice Recording Logic
  const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const fileName = `audio/${user?.uid}/${Date.now()}.webm`;
        const fileRef = sRef(storage, fileName);
        
        try {
          const uploadRes = await uploadBytes(fileRef, audioBlob);
          const url = await getDownloadURL(uploadRes.ref);
          
          if (chatId && user) {
            await addDoc(collection(db, "chats", chatId, "messages"), {
              audioUrl: url,
              userId: user.uid,
              email: user.email,
              type: "audio",
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.error("Upload failed", err);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Please allow microphone access");
    }
  };

  const stopRecording = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Ավտոմատ scroll դեպի ներքև
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  if (!user) return <div className="h-screen flex items-center justify-center font-bold">Connecting...</div>;

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tighter uppercase">Stone Chat</h1>
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full" onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-indigo-100 transition-all"/>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
          {users.map((u) => (
            <div 
              key={u.uid} 
              onClick={() => { navigate(`/chat/${getChatId(user.uid, u.uid)}`); setIsSidebarOpen(false); }}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${chatId === getChatId(user.uid, u.uid) ? "bg-indigo-50 shadow-sm" : "hover:bg-gray-50"}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 overflow-hidden flex items-center justify-center text-white font-bold shadow-md text-xl">
                  {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover"/> : u.email[0].toUpperCase()}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${u.state === "online" ? "bg-green-500" : "bg-gray-300"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-[15px]">{u.email.split('@')[0]}</p>
                <p className={`text-xs ${u.state === "online" ? "text-green-500 font-medium" : "text-gray-400"}`}>{u.state === "online" ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col bg-white lg:m-4 lg:rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative z-10">
        {chatId ? (
          <>
            <header className="h-20 flex items-center justify-between px-8 border-b border-gray-50 bg-white/90 backdrop-blur-md z-20">
              <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full" onClick={() => setIsSidebarOpen(true)}><Menu/></button>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                   {users.find(u => getChatId(user.uid, u.uid) === chatId)?.email?.[0].toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-900 truncate max-w-[150px] lg:max-w-none">
                    {users.find(u => getChatId(user.uid, u.uid) === chatId)?.email.split('@')[0] || "Chat"}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> SECURE
                  </div>
                </div>
              </div>
              <button onClick={() => navigate(`/video-call/${chatId}`)} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl border border-indigo-50 transition-all active:scale-90 shadow-sm"><Video size={22}/></button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fcfdfe] custom-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.userId === user.uid ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] lg:max-w-[65%]">
                    <div className={`p-4 rounded-[1.8rem] shadow-sm text-[15px] transition-all ${
                      m.userId === user.uid 
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100" 
                      : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                    }`}>
                      {m.type === "text" ? (
                        <p className="leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                      ) : (
                        <div className="flex items-center gap-2 min-w-[200px]">
                          <audio src={m.audioUrl} controls className="h-8 w-full brightness-95" />
                        </div>
                      )}
                      <div className={`text-[10px] mt-2 flex justify-end opacity-60 font-medium ${m.userId === user.uid ? "text-indigo-100" : "text-gray-400"}`}>
                        {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer className="p-6 bg-white border-t border-gray-50">
              <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 p-2 rounded-[1.5rem] border border-gray-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-indigo-50 transition-all">
                <button 
                   onMouseDown={startRecording}
                   onMouseUp={stopRecording}
                   onTouchStart={startRecording}
                   onTouchEnd={stopRecording}
                   className={`p-3 rounded-xl transition-all active:scale-75 ${isRecording ? "bg-red-500 text-white animate-pulse shadow-lg" : "text-gray-400 hover:text-indigo-600"}`}
                >
                  {isRecording ? <StopCircle size={24}/> : <Mic size={24}/>}
                </button>
                <input 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isRecording ? "Recording..." : "Type a message..."}
                  disabled={isRecording}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] outline-none py-3"
                />
                <button 
                  onClick={handleSend}
                  disabled={!text.trim() || isRecording}
                  className={`p-4 rounded-2xl transition-all active:scale-95 ${text.trim() && !isRecording ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-200 text-white"}`}
                >
                  <Send size={20}/>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-gray-50">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 transform -rotate-6">
              <Send size={48} className="text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase">Stone Market Messenger</h2>
            <p className="text-gray-500 max-w-[250px] text-sm mt-3 leading-relaxed">
              Ընտրիր ընկերոջը sidebar-ից՝ ապահով զրույց սկսելու համար:
            </p>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}