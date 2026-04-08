import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../firebase/config";

// 1. Սահմանում ենք օգտատիրոջ տվյալների տիպը Firebase-ից
interface UserData {
  email: string;
  displayName?: string;
  state: "online" | "offline";
  lastChanged: number;
}

const UserProfile: React.FC = () => {
  // 2. useParams-ի միջոցով ստանում ենք uid-ն և նշում, որ այն string է
  const { uid } = useParams<{ uid: string }>(); 
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!uid) return;

    const db = getDatabase();
    const userRef = ref(db, `status/${uid}`);

    // onValue-ն ավտոմատ թարմացնում է տվյալները, եթե դրանք փոխվեն բազայում
    const unsub = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUserData(data);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const handleStartPrivateChat = (): void => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.uid === uid) {
      alert("Դուք չեք կարող չատ սկսել ինքներդ ձեզ հետ:");
      return;
    }

    if (uid) {
      // Ստեղծում ենք ունիկալ Chat ID (նույն տրամաբանությամբ, ինչ սերվերում)
      const combinedId = [currentUser.uid, uid].sort().join("_");
      navigate(`/chat/${combinedId}`);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Բեռնվում է...</div>;
  if (!userData) return <div className="p-10 text-center text-red-500 font-medium">Օգտատերը չգտնվեց:</div>;

  // Օգնող փոփոխական՝ անվան համար
  const userName = userData.displayName || userData.email.split("@")[0];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-3xl border border-gray-50">
      <div className="flex flex-col items-center">
        {/* Profile Avatar */}
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-500 text-white rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-xl border-4 border-white">
          {userData.email[0].toUpperCase()}
        </div>

        {/* User Info */}
        <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
          {userName}
        </h1>
        <p className="text-gray-400 font-medium mb-4">{userData.email}</p>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-8 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
          <span className={`w-3 h-3 rounded-full animate-pulse ${userData.state === "online" ? "bg-green-500" : "bg-gray-400"}`}></span>
          <span className="text-xs font-black uppercase tracking-widest text-gray-600">
            {userData.state}
          </span>
        </div>

        {/* Message Button */}
        <button
          onClick={handleStartPrivateChat}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all transform active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          ԳՐԵԼ ՆԱՄԱԿ
        </button>
      </div>

      {/* Last Seen Section */}
      <div className="mt-10 border-t border-gray-100 pt-6 text-gray-400 text-xs font-medium text-center uppercase tracking-tighter">
        Վերջին անգամ տեսնվել է՝ <span className="text-gray-600">{userData.lastChanged ? new Date(userData.lastChanged).toLocaleString('hy-AM') : "Անհայտ"}</span>
      </div>
    </div>
  );
};

export default UserProfile;