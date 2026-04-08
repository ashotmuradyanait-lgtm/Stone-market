import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db, rtdb } from "../firebase/config";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";
import { 
  collection, query, where, onSnapshot, orderBy, 
  doc, updateDoc, addDoc, serverTimestamp, limit 
} from "firebase/firestore";
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbTimestamp, DataSnapshot } from "firebase/database";
import { getChatId, markAsRead } from "../firebase/chat";

// --- INTERFACES ---
interface IMessage {
  id: string;
  text?: string;
  userId: string;
  email: string;
  type: "text" | "audio" | "video";
  audioUrl?: string;
  videoUrl?: string;
  createdAt: any;
  read?: boolean;
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

// 1. Ավելացնում ենք Props-ի տիպավորումը
interface ChatProps {
  user: User;
}

export default function Chat({ user }: ChatProps) {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const storage = getStorage();

  // State-երը
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [allStatuses, setAllStatuses] = useState<IUserStatus[]>([]);
  const [incomingCall, setIncomingCall] = useState<ICall | null>(null);
  const [text, setText] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);

  // Refs
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const msgSound = useRef<HTMLAudioElement>(new Audio("/message-pop.mp3"));

  // 1. Online Status (միայն այս օգտատիրոջ համար)
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
  }, [user]);

  // 2. Load All Statuses
  useEffect(() => {
    const allStatusRef = ref(rtdb, "status");
    return onValue(allStatusRef, (snap: DataSnapshot) => {
      if (snap.exists()) {
        const data = Object.entries(snap.val() as Record<string, any>).map(([id, val]) => ({ 
          id, 
          ...val 
        } as IUserStatus));
        setAllStatuses(data);
      }
    });
  }, []);

  // 3. Incoming Call Listener
  useEffect(() => {
    const q = query(
      collection(db, "calls"), 
      where("receiverId", "==", user.uid), 
      where("status", "==", "pending"),
      limit(1)
    );
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIncomingCall({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ICall);
      } else {
        setIncomingCall(null);
      }
    });
  }, [user.uid]);

  // 4. Messages Listener
  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as IMessage));
      
      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" && change.doc.data().userId !== user.uid) {
            msgSound.current.play().catch(() => {});
          }
        });
      }
      
      setMessages(docs);
      markAsRead(chatId, docs as any, user.uid);
      isInitialLoad = false;
    });
    return () => unsubscribe();
  }, [chatId, user.uid]);

  // 5. Recording Logic
  const startMediaRecording = async (type: "audio" | "video" = "audio") => {
    try {
      const isVideo = type === "video";
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
      streamRef.current = stream;

      const mimeType = isVideo ? 'video/webm' : 'audio/webm';
      mediaRecorder.current = new MediaRecorder(stream);
      mediaChunks.current = [];

      mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) mediaChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(mediaChunks.current, { type: mimeType });
        const fileName = `${type}_${Date.now()}`;
        const fileRef = sRef(storage, `${type}/${fileName}`);

        try {
          if (!chatId) return;
          const uploadResult = await uploadBytes(fileRef, blob);
          const url = await getDownloadURL(uploadResult.ref);

          await addDoc(collection(db, "chats", chatId, "messages"), {
            [isVideo ? "videoUrl" : "audioUrl"]: url,
            userId: user.uid,
            email: user.email,
            type: type,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Upload Error:", error);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      isVideo ? setIsVideoRecording(true) : setIsRecording(true);
    } catch (e) {
      alert("Տեսախցիկի կամ միկրոֆոնի խնդիր:");
    }
  };

  const stopMediaRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsVideoRecording(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !chatId) return;
    const mText = text;
    setText("");
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: mText,
      userId: user.uid,
      email: user.email,
      type: "text",
      createdAt: serverTimestamp()
    });
  };

  const unlockAudio = () => {
    msgSound.current.play().then(() => {
      msgSound.current.pause();
      msgSound.current.currentTime = 0;
    }).catch(() => {});
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden" onClick={unlockAudio}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform lg:relative lg:translate-x-0`}>
        <div className="p-4 text-white font-bold border-b border-gray-800 flex justify-between">
          Օգտատերեր
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>
        <div className="overflow-y-auto h-full p-2">
          {allStatuses.filter(s => s.id !== user.uid).map(s => (
            <div 
              key={s.id} 
              onClick={() => { navigate(`/chat/${getChatId(user.uid, s.id)}`); setIsSidebarOpen(false); }}
              className="p-3 mb-2 rounded-xl bg-gray-800 hover:bg-gray-700 cursor-pointer flex items-center gap-3 transition-colors"
            >
              <div className={`w-3 h-3 rounded-full ${s.state === "online" ? "bg-green-500 shadow-[0_0_8px_green]" : "bg-gray-500"}`} />
              <span className="text-gray-200 text-sm truncate">{s.email}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-4 border-b flex items-center justify-between bg-white shadow-sm">
          <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <div className="font-bold text-gray-800 truncate px-4">
            {chatId ? "Անձնական չատ" : "Ընտրեք օգտատեր"}
          </div>
          {chatId && (
             <div className="flex gap-2">
                <button onClick={() => navigate(`/video-call/${chatId}`)} className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200">📹</button>
             </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.userId === user.uid ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${m.userId === user.uid ? "bg-indigo-600 text-white" : "bg-white text-gray-800"}`}>
                {m.type === "text" && <p>{m.text}</p>}
                {m.type === "audio" && <audio src={m.audioUrl} controls className="max-w-full" />}
                {m.type === "video" && <video src={m.videoUrl} controls className="max-w-full rounded-lg" />}
                <div className="text-[10px] mt-1 opacity-60 text-right">
                  {m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {chatId && (
          <footer className="p-4 bg-white border-t flex items-center gap-2">
            <button 
                onMouseDown={() => startMediaRecording("audio")} 
                onMouseUp={stopMediaRecording}
                className={`p-3 rounded-full transition-all ${isRecording ? "bg-red-500 animate-pulse text-white" : "bg-gray-100 text-gray-600"}`}
            >
              🎤
            </button>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Գրել հաղորդագրություն..."
              className="flex-1 p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button onClick={handleSend} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md">
              ➤
            </button>
          </footer>
        )}
      </div>

      {/* Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">📞</div>
            <h2 className="text-xl font-bold mb-2">Մուտքային զանգ</h2>
            <p className="text-gray-500 mb-6">{incomingCall.callerEmail}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={async () => {
                  await updateDoc(doc(db, "calls", incomingCall.id), { status: "accepted" });
                  navigate(`/video-call/${incomingCall.roomId}`);
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600"
              >
                Պատասխանել
              </button>
              <button 
                onClick={() => updateDoc(doc(db, "calls", incomingCall.id), { status: "rejected" })}
                className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600"
              >
                Մերժել
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}