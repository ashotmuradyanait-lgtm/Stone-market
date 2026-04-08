import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "firebase/auth"; // Firebase-ի ներդրված տիպը

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chat from "./components/Chat";
import Login from "./components/Login";
import VideoCall from "./components/VideoCall";
import Stories from "./components/Stories";

// Pages
import UserProfile from "./pages/UserProfile"; 
import Home from "./pages/Home";
import Design from "./pages/Design";
import Dizayner from "./pages/Dizayner";
import Kap from "./pages/Kap";
import Like from "./pages/Like";
import Mermasin from "./pages/Mermasin";
import Xanut from "./pages/Xanut";
import Project from "./designs/Project";

// Firebase & Presence
import { observeAuth } from "./firebase/auth";
import { setupPresence } from "./firebase/presence";

// App.tsx
export interface Product {
  name: string;
  price: string; // Հեռացրու | number-ը, թող միայն string
  img: string;
  desc: string;
}

function App() {
  // 2. Տիպավորում ենք state-երը
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Wishlist Logic
  const handleLike = (product: Product): void => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.name === product.name);
      return exists
        ? prev.filter((p) => p.name !== product.name)
        : [...prev, product];
    });
  };

  // Auth Observer
  useEffect(() => {
    const unsub = observeAuth((u: User | null) => {
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
      <div className="flex justify-center items-center h-screen font-bold text-indigo-600 animate-pulse text-xl">
        Բեռնվում է...
      </div>
    );
  }

  return (
    <>
      {/* Header-ին փոխանցում ենք wishlist-ի քանակը */}
      <Header wishlistCount={wishlist.length} />

      <Stories />

      <Routes>
        {/* --- ՀԱՆՐԱՅԻՆ ԷՋԵՐ --- */}
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<Design />} />
        <Route path="/dizayner" element={<Dizayner />} />
        <Route path="/kap" element={<Kap />} />
        <Route path="/mermasin" element={<Mermasin />} />
        <Route path="/xanut" element={<Xanut onLike={handleLike} wishlist={wishlist} />} />
        <Route path="/like" element={<Like wishlist={wishlist} onLike={handleLike} />} />
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

        {/* --- 404 / REDIRECT --- */}
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