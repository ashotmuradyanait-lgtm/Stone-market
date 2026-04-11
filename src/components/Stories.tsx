import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/config';
import { 
  collection, query, onSnapshot, serverTimestamp, 
  addDoc, orderBy, doc, updateDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore';

// TypeScript Interface-ներ
interface IComment {
  id: string;
  text: string;
  userEmail: string;
  createdAt: any;
}

interface IStory {
  id: string;
  contentUrl: string;
  type: "video" | "image";
  userEmail: string;
  createdAt: any;
  likes?: string[];
}

export default function Stories() {
  const [stories, setStories] = useState<IStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  
  // Ref-երը TypeScript-ի համար
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Stories Snapshot (24 ժամվա ֆիլտրով)
  useEffect(() => {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;

      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as IStory)).filter(story => {
        if (!story.createdAt) return true; // Նոր գցած story-ն միանգամից երևա
        return (now - story.createdAt.toMillis()) < dayInMs;
      });

      setStories(docs);
    });

    return () => unsubscribe();
  }, []);

  // 2. Comments Snapshot
  useEffect(() => {
    if (!selectedStory) { setComments([]); return; }
    const q = query(collection(db, "stories", selectedStory.id, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IComment)));
    });
    return () => unsubscribe();
  }, [selectedStory]);

  // --- Վիդեո նկարել ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      });
      
      setIsRecording(true);
      setRecordingTime(0);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 200);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          await addDoc(collection(db, "stories"), {
            contentUrl: reader.result as string,
            type: "video",
            userEmail: auth.currentUser?.email || "Անանուն",
            createdAt: serverTimestamp(),
            likes: []
          });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error(err);
      alert("Կամերան չմիացավ");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  // --- Ֆայլ գցել (Նկար/Վիդեո) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      await addDoc(collection(db, "stories"), {
        contentUrl: reader.result as string,
        type: file.type.startsWith('image/') ? "image" : "video",
        userEmail: auth.currentUser?.email || "Անանուն",
        createdAt: serverTimestamp(),
        likes: []
      });
    };
  };

  // --- Like & Comment ---
  const handleLike = async (e: React.MouseEvent, story: IStory) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    const storyRef = doc(db, "stories", story.id);
    const isLiked = story.likes?.includes(auth.currentUser.uid);
    await updateDoc(storyRef, {
      likes: isLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedStory || !auth.currentUser) return;
    await addDoc(collection(db, "stories", selectedStory.id, "comments"), {
      text: newComment,
      userEmail: auth.currentUser.email,
      createdAt: serverTimestamp()
    });
    setNewComment("");
  };

  return (
    <div className="relative font-sans select-none">
      {/* Stories Bar */}
      <div className="flex p-4 overflow-x-auto gap-4 bg-white items-center border-b no-scrollbar">
        <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={handleFileUpload} />
        
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-full bg-blue-600 text-white text-3xl shadow-md active:scale-90 transition-transform">+</button>
          <span className="text-[10px] text-gray-500 font-bold">ՖԱՅԼ</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button onClick={startRecording} className="w-16 h-16 rounded-full bg-gray-100 border-2 border-red-500 text-2xl flex items-center justify-center active:scale-90 transition-transform">🎥</button>
          <span className="text-[10px] text-gray-500 font-bold">ՆԿԱՐԵԼ</span>
        </div>

        {stories.map((story) => (
          <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer active:opacity-70" onClick={() => setSelectedStory(story)}>
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-600">
               <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-200">
                  {story.type === 'image' ? <img src={story.contentUrl} className="w-full h-full object-cover" alt="" /> : <video src={story.contentUrl} className="w-full h-full object-cover" />}
               </div>
            </div>
            <span className="text-[10px] text-gray-500 truncate w-16 text-center">{story.userEmail?.split('@')[0]}</span>
          </div>
        ))}
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 z-[8000] bg-black flex items-center justify-center">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute top-10 bg-red-600 px-4 py-1 rounded-full text-white font-bold animate-pulse">{recordingTime}վ</div>
            <button onClick={stopRecording} className="absolute bottom-10 w-20 h-20 rounded-full border-4 border-white bg-red-600 shadow-2xl flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-sm" />
            </button>
        </div>
      )}

      {/* Story Viewer */}
      {selectedStory && (
        <div className="fixed inset-0 z-[7000] bg-black flex flex-col" onClick={() => setSelectedStory(null)}>
           <div className="relative flex-1 flex items-center justify-center">
             <button className="absolute top-6 right-6 text-white text-3xl z-[7010]">&times;</button>
             {selectedStory.type === 'image' ? <img src={selectedStory.contentUrl} className="max-h-full object-contain" alt="" /> : <video src={selectedStory.contentUrl} autoPlay className="max-h-full object-contain" />}
             
             <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/60 to-transparent" onClick={e => e.stopPropagation()}>
                <div className="max-h-40 overflow-y-auto mb-4 space-y-2 no-scrollbar">
                  {comments.map(c => (
                    <div key={c.id} className="text-white text-sm"><span className="font-bold text-blue-400">{c.userEmail.split('@')[0]}:</span> {c.text}</div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => handleLike(e, selectedStory)} className="text-2xl drop-shadow-lg active:scale-125 transition-transform">
                    {selectedStory.likes?.includes(auth.currentUser?.uid || "") ? "❤️" : "🤍"}
                  </button>
                  <input 
                    className="flex-1 bg-white/20 backdrop-blur-lg rounded-full px-4 py-2 text-white border border-white/20 outline-none focus:bg-white/30" 
                    placeholder="Գրել մեկնաբանություն..." 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  />
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}