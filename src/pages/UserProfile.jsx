import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../firebase/config"; // Համոզվիր, որ այս path-ը ճիշտ է

export default function UserProfile() {
  const { uid } = useParams(); // Սա այն մարդու ID-ն է, ում պրոֆիլում ենք
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `status/${uid}`);

    const unsub = onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const handleStartPrivateChat = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.uid === uid) {
      alert("Դուք չեք կարող չատ սկսել ինքներդ ձեզ հետ:");
      return;
    }

    // Ստեղծում ենք նույն ունիկալ Chat ID-ն, ինչ Sidebar-ում
    // sort-ը կարևոր է, որ ID-ն միշտ նույնը լինի երկուսիդ մոտ էլ
    const combinedId = [currentUser.uid, uid].sort().join("_");

    // Տանում ենք օգտատիրոջը դեպի այդ առանձին չատի էջը
    navigate(`/chat/${combinedId}`);
  };

  if (loading) return <div className="p-10 text-center">Բեռնվում է...</div>;
  if (!userData) return <div className="p-10 text-center">Օգտատերը չգտնվեց:</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex flex-col items-center">
        {/* Profile Avatar */}
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
          {userData.email ? userData.email[0].toUpperCase() : "?"}
        </div>

        {/* User Info */}
        <h1 className="text-2xl font-black text-gray-800 mb-1">
          {userData.displayName || userData.email.split("@")[0]}
        </h1>
        <p className="text-gray-500 mb-4">{userData.email}</p>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-3 h-3 rounded-full ${userData.state === "online" ? "bg-green-500" : "bg-gray-400"}`}></span>
          <span className="text-sm font-bold uppercase text-gray-600">{userData.state}</span>
        </div>

        {/* --- ՄԵՍԻՋԻ ԿՈՃԱԿԸ --- */}
        <button
          onClick={handleStartPrivateChat}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          Գրել նամակ (Private Chat)
        </button>
      </div>

      <div className="mt-8 border-t pt-6 text-gray-600 text-sm italic text-center">
        Վերջին անգամ տեսնվել է՝ {userData.lastChanged ? new Date(userData.lastChanged).toLocaleString() : "Անհայտ"}
      </div>
    </div>
  );
}