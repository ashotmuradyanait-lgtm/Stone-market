import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Պարզ հարցում, որպեսզի Index-ի սխալ չտա
    const q = query(collection(db, "stories"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        // Ֆիլտրում ենք 24 ժամը հենց այստեղ
        .filter(story => story.createdAt?.toMillis() > twentyFourHoursAgo)
        // Դասավորում ենք՝ նորերը սկզբում
        .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

      setStories(docs);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 854 } }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Օգտագործում ենք ստանդարտ format, որ բոլոր սարքերը հասկանան
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          try {
            await addDoc(collection(db, "stories"), {
              contentUrl: reader.result,
              type: "video",
              userEmail: auth.currentUser?.email || "Անանուն",
              createdAt: serverTimestamp()
            });
          } catch (err) {
            console.error("Firestore Upload Error:", err);
          }
          
          // Անջատում ենք տեսախցիկը
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        };
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Խնդրում ենք թույլատրել տեսախցիկի օգտագործումը");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="relative">
      <div className="flex p-4 overflow-x-auto gap-4 bg-white no-scrollbar items-center border-b shadow-sm">
        
        {/* Record Button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
              isRecording ? 'border-red-500 bg-white' : 'border-blue-500 bg-blue-600 text-white'
            }`}
          >
            {isRecording ? <div className="w-6 h-6 bg-red-600 rounded-sm animate-pulse" /> : <span className="text-3xl">+</span>}
          </button>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
            {isRecording ? `${recordingTime}վ` : "Նկարել"}
          </span>
        </div>

        {/* Stories List */}
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
               <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-200 shadow-inner">
                  <video src={story.contentUrl} className="w-full h-full object-cover" />
               </div>
            </div>
            <span className="text-[10px] font-medium text-gray-500 truncate w-16 text-center">
              {story.userEmail?.split('@')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Recording Screen */}
      {isRecording && (
        <div className="fixed inset-0 z-[6000] bg-black flex flex-col items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-10 flex flex-col items-center gap-2">
               <div className="bg-red-600 px-6 py-2 rounded-full text-white font-black text-lg animate-pulse shadow-xl">
                  {recordingTime} վայրկյան
               </div>
            </div>
            <button 
              onClick={stopRecording}
              className="absolute bottom-12 w-20 h-20 bg-white rounded-full border-8 border-gray-400 flex items-center justify-center active:scale-90 transition-transform"
            >
               <div className="w-10 h-10 bg-red-600 rounded-lg shadow-lg" />
            </button>
        </div>
      )}

      {/* Full Screen Viewer */}
      {selectedStory && (
        <div className="fixed inset-0 z-[7000] bg-black flex items-center justify-center" onClick={() => setSelectedStory(null)}>
           <div className="absolute top-6 left-6 flex items-center gap-3 z-[7001]">
              <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">
                {selectedStory.userEmail[0].toUpperCase()}
              </div>
              <span className="text-white font-bold shadow-md">{selectedStory.userEmail?.split('@')[0]}</span>
           </div>
           
           <button className="absolute top-6 right-6 text-white text-5xl font-thin">&times;</button>
           
           <div className="w-full max-w-lg h-screen md:h-[90vh] bg-black md:rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
             <video 
               src={selectedStory.contentUrl} 
               autoPlay 
               playsInline
               onEnded={() => setSelectedStory(null)} 
               className="w-full h-full object-contain" 
             />
           </div>
        </div>
      )}
    </div>
  );
}