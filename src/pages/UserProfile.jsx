import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";

const UserProfile = () => {
  const { uid } = useParams(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, `users/${uid}`); 

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        console.log("Օգտատերը չի գտնվել");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  if (loading) return <div className="p-10 text-center">Բեռնվում է...</div>;

  if (!userData) {
    return (
      <div className="p-10 text-center">
        <p>Օգտատերը չի գտնվել:</p>
        <button 
          onClick={() => navigate("/chat")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Վերադառնալ չատ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex flex-col items-center">
        <img 
          src={userData.photoURL || "https://via.placeholder.com/150"} 
          alt={userData.displayName} 
          className="w-32 h-32 rounded-full border-4 border-blue-100 mb-4 object-cover"
        />
        
        <h1 className="text-2xl font-bold text-gray-800">
          {userData.displayName || "Անունը նշված չէ"}
        </h1>

        <div className="flex items-center mt-2">
          <span className={`h-3 w-3 rounded-full mr-2 ${userData.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="text-gray-600 capitalize">{userData.status || 'offline'}</span>
        </div>
        <div className="mt-6 w-full border-t pt-4">
          <p className="text-sm text-gray-500">Էլ. հասցե</p>
          <p className="text-gray-700">{userData.email || "Թաքնված է"}</p>
        </div>

        <button 
          onClick={() => navigate("/chat")}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
        >
          Գրել հաղորդագրություն
        </button>
      </div>
    </div>
  );
};

export default UserProfile;