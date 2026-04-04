import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";


import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";


import Chat from "./components/Chat.jsx";
import Login from "./components/Login.jsx";
import VideoCall from "./components/VideoCall.jsx";
import Stories from "./components/Stories.jsx"; // <--- Ավելացրինք Stories-ը


import UserProfile from "./pages/UserProfile.jsx"; 
import Home from "./pages/Home.jsx";
import Design from "./pages/Design.jsx";
import Dizayner from "./pages/Dizayner.jsx";
import Kap from "./pages/Kap.jsx";
import Like from "./pages/Like.jsx";
import Mermasin from "./pages/Mermasin.jsx";
import Xanut from "./pages/Xanut.jsx";
import Project from "./designs/Project.jsx";

// Firebase & Presence
import { observeAuth } from "./firebase/auth";
import { setupPresence } from "./firebase/presence";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Wishlist Logic
  const handleLike = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.name === product.name);
      return exists
        ? prev.filter((p) => p.name !== product.name)
        : [...prev, product];
    });
  };

  // Auth Observer
  useEffect(() => {
    const unsub = observeAuth((u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        setupPresence(u.uid);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-bold text-indigo-600">
        Բեռնվում է...
      </div>
    );
  }

  return (
    <>
      {/* Header-ին փոխանցում ենք wishlist-ի քանակը */}
      <Header wishlistCount={wishlist.length} />

      {/* Stories-ը տեղադրում ենք այստեղ, որպեսզի այն միշտ լինի վերևում */}
      <Stories />

      <Routes>
        {/* --- ՀԱՆՐԱՅԻՆ ԷՋԵՐ --- */}
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<Design />} />
        <Route path="/dizayner" element={<Dizayner />} />
        <Route path="/kap" element={<Kap />} />
        <Route path="/mermasin" element={<Mermasin />} />
        <Route path="/xanut" element={<Xanut onLike={handleLike} />} />
        <Route path="/like" element={<Like wishlist={wishlist} />} />
        <Route path="/project/:id" element={<Project />} />

        {/* --- ՊԱՇՏՊԱՆՎԱԾ ԷՋԵՐ --- */}
        <Route 
          path="/profile/:uid" 
          element={user ? <UserProfile /> : <Navigate to="/login" />} 
        />
        <Route
          path="/chat"
          element={user ? <Chat user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:chatId"
          element={user ? <Chat user={user} /> : <Navigate to="/login" />}
        />
        <Route 
          path="/video-call/:roomId" 
          element={user ? <VideoCall /> : <Navigate to="/login" />} 
        />

        {/* --- AUTH --- */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/chat" />}
        />

        <Route
          path="*"
          element={<Navigate to={user ? "/chat" : "/login"} />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;