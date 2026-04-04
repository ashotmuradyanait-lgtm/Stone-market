import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db, rtdb } from "../firebase/config";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, query, where, onSnapshot, orderBy, 
  doc, updateDoc, addDoc, serverTimestamp, limit 
} from "firebase/firestore";
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbTimestamp } from "firebase/database";
import { getChatId, markAsRead } from "../firebase/chat";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const storage = getStorage();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [text, setText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);

  const scrollRef = useRef(null);
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([]);
  const streamRef = useRef(null);
  const msgSound = useRef(new Audio("/message-pop.mp3"));

  // 1. Auth & Online Status
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const statusRef = ref(rtdb, `status/${u.uid}`);
        set(statusRef, { state: "online", email: u.email, id: u.uid, last_changed: rtdbTimestamp() });
        onDisconnect(statusRef).set({ state: "offline", email: u.email, id: u.uid, last_changed: rtdbTimestamp() });
      } else {
        navigate("/login");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  // 2. Load Statuses
  useEffect(() => {
    const allStatusRef = ref(rtdb, "status");
    return onValue(allStatusRef, (snap) => {
      if (snap.exists()) {
        const data = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
        setAllStatuses(data);
      }
    });
  }, []);

  // 3. Incoming Call Listener
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "calls"), 
      where("receiverId", "==", user.uid), 
      where("status", "==", "pending"),
      limit(1)
    );
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIncomingCall({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setIncomingCall(null);
      }
    });
  }, [user]);

  // 4. Messages & Sound
  useEffect(() => {
    if (!chatId || !user) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (!isInitialLoad) {
        snapshot.docChanges().forEach((change) => {
          // Ձայնը հանում ենք միայն նոր եկած նամակների դեպքում, որոնք մերը չեն
          if (change.type === "added" && change.doc.data().userId !== user.uid) {
            msgSound.current.play().catch(e => console.log("Audio play error:", e));
          }
        });
      }
      
      setMessages(docs);
      markAsRead(chatId, docs, user.uid);
      isInitialLoad = false;
    });
    return () => unsubscribe();
  }, [chatId, user]);

  // 5. Media Recording (Audio/Video)
  const startMediaRecording = async (type = "audio") => {
    try {
      const isVideo = type === "video";
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
      streamRef.current = stream;

      const mimeType = isVideo ? 'video/webm' : 'audio/webm';
      mediaRecorder.current = new MediaRecorder(stream);
      mediaChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) mediaChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(mediaChunks.current, { type: mimeType });
        const fileName = `${type}_${Date.now()}`;
        const fileRef = sRef(storage, `${type}/${fileName}`);

        try {
          const uploadResult = await uploadBytes(fileRef, blob);
          const url = await getDownloadURL(uploadResult.ref);

          await addDoc(collection(db, "chats", chatId, "messages"), {
            [isVideo ? "videoUrl" : "audioUrl"]: url,
            userId: user.uid,
            email: user.email,
            type: type, // "audio" կամ "video"
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
    if (!text.trim() || !user || !chatId) return;
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
      {/* HEADER */}
      <div className="h-16 bg-indigo-600 text-white flex items-center justify-between px-4 shadow-md shrink-0">
        <div className="flex items-center gap-2">
          <button className="md:hidden p-2 text-2xl" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <h1 className="font-black italic tracking-tighter text-xl uppercase tracking-widest">Stone Chat</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onMouseDown={() => startMediaRecording("video")} 
            onMouseUp={stopMediaRecording}
            onTouchStart={(e) => { e.preventDefault(); startMediaRecording("video"); }}
            onTouchEnd={(e) => { e.preventDefault(); stopMediaRecording(); }}
            className={`px-4 py-2 rounded-xl font-bold text-[10px] transition-all shadow-sm ${isVideoRecording ? "bg-red-500 animate-pulse" : "bg-indigo-400 hover:bg-indigo-500"}`}
          >
            {isVideoRecording ? "REC..." : "VIDEO MSG"}
          </button>
          <button onClick={() => navigate(`/video-call/${chatId}`)} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm">
            Call
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <div className={`${isSidebarOpen ? "fixed inset-0" : "hidden"} md:relative md:flex flex-col w-full md:w-72 bg-white border-r z-50`}>
          <div className="p-4 flex justify-between items-center border-b md:hidden bg-gray-50">
            <span className="font-bold text-indigo-600 uppercase text-xs">Contacts</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-xl p-2">✕</button>
          </div>
          <div className="overflow-y-auto flex-1">
            {allStatuses.map(s => s.id !== user?.uid && (
              <div key={s.id} onClick={() => { navigate(`/chat/${getChatId(user.uid, s.id)}`); setIsSidebarOpen(false); }}
                   className={`p-4 border-b flex items-center gap-3 cursor-pointer hover:bg-indigo-50 ${chatId?.includes(s.id) ? "bg-indigo-50 border-r-4 border-indigo-600" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">{s.email?.[0].toUpperCase()}</div>
                <div className="text-sm font-semibold text-gray-700 truncate flex-1">{s.email?.split('@')[0]}</div>
                <div className={`w-2.5 h-2.5 rounded-full ${s.state === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT MAIN */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.userId === user?.uid ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 px-4 rounded-2xl max-w-[85%] shadow-sm ${m.userId === user?.uid ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-tl-none"}`}>
                  
                  {m.type === "video" ? (
                    <video src={m.videoUrl} controls className="w-48 md:w-64 rounded-lg" />
                  ) : m.type === "audio" ? (
                    <audio src={m.audioUrl} controls className="h-10 w-48 md:w-64" />
                  ) : (
                    <p className="text-sm font-medium break-words">{m.text}</p>
                  )}

                  <div className={`text-[9px] mt-1 text-right ${m.userId === user?.uid ? "text-indigo-200" : "text-gray-400"}`}>
                    {m.createdAt?.toDate() ? m.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "..."}
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white border-t flex gap-2 items-center">
            <button 
              onMouseDown={() => startMediaRecording("audio")} 
              onMouseUp={stopMediaRecording}
              onTouchStart={(e) => { e.preventDefault(); startMediaRecording("audio"); }}
              onTouchEnd={(e) => { e.preventDefault(); stopMediaRecording(); }}
              className={`p-4 rounded-full transition-all shadow-md ${isRecording ? "bg-red-500 animate-pulse text-white scale-110" : "bg-gray-100 text-gray-400"}`}
            >
              🎤
            </button>
            <input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1 bg-gray-50 p-3 rounded-2xl outline-none text-sm border focus:border-indigo-300" 
              placeholder={isRecording ? "Ձայնագրվում է..." : "Գրիր նամակ..."} 
            />
            <button onClick={handleSend} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase shadow-lg">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* CALL MODAL */}
      {incomingCall && (
        <div className="fixed inset-0 bg-indigo-900/90 backdrop-blur-lg flex items-center justify-center z-[100] text-white p-6 text-center">
          <div className="bg-white/10 p-10 rounded-[40px] border border-white/20 shadow-2xl w-full max-w-sm">
            <div className="text-6xl mb-6 animate-bounce">📞</div>
            <h2 className="text-2xl font-black mb-2 uppercase">{incomingCall.callerEmail?.split('@')[0]}</h2>
            <p className="text-indigo-200 text-sm mb-8">Incoming Call...</p>
            <div className="flex gap-4">
              <button onClick={() => updateDoc(doc(db, "calls", incomingCall.id), { status: "rejected" })} className="bg-red-500 px-8 py-3 rounded-2xl font-bold flex-1">Reject</button>
              <button onClick={() => { updateDoc(doc(db, "calls", incomingCall.id), { status: "accepted" }); navigate(`/video-call/${incomingCall.roomId}`); }} className="bg-green-500 px-8 py-3 rounded-2xl font-bold flex-1">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}