import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase/config";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 1. Ստանում ենք վերջին 24 ժամվա story-ները
  useEffect(() => {
    const twentyFourHoursAgo = new Timestamp(
      Timestamp.now().seconds - 24 * 60 * 60,
      0
    );

    const q = query(
      collection(db, "stories"),
      where("createdAt", ">", twentyFourHoursAgo),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(docs);
    });

    return () => unsubscribe();
  }, []);

  // 2. Story ավելացնելու ֆունկցիա
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const fileRef = ref(storage, `stories/${auth.currentUser.uid}_${Date.now()}`);

    try {
      const uploadResult = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, "stories"), {
        imageUrl: url,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      alert("Story-ն տեղադրվեց:");
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-b overflow-x-auto flex gap-4 items-center">
      {/* Ավելացնել Story կոճակ */}
      <label className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-dashed border-indigo-500 flex items-center justify-center cursor-pointer hover:bg-indigo-50 transition-all">
        <span className="text-2xl text-indigo-500">{uploading ? "..." : "+"}</span>
        <input type="file" hidden accept="image/*,video/*" onChange={handleUpload} disabled={uploading} />
      </label>

      {/* Story-ների ցուցակը */}
      <div className="flex gap-3">
        {stories.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-0.5 shadow-sm overflow-hidden bg-white">
              <img 
                src={s.imageUrl} 
                className="w-full h-full object-cover rounded-full" 
                alt="story"
                onClick={() => window.open(s.imageUrl, "_blank")} // Կարող ես սարքել Modal բացվելու համար
              />
            </div>
            <span className="text-[10px] text-gray-500 truncate w-16 text-center">
              {s.userEmail.split('@')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}