import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Chat from "./components/Chat.jsx";
import Login from "./components/Login.jsx";
import UserProfile from "./pages/UserProfile.jsx"; 

import Home from "./pages/Home.jsx";
import Design from "./pages/Design.jsx";
import Dizayner from "./pages/Dizayner.jsx";
import Kap from "./pages/Kap.jsx";
import Like from "./pages/Like.jsx";
import Mermasin from "./pages/Mermasin.jsx";
import Xanut from "./pages/Xanut.jsx";
import Project from "./designs/Project.jsx";

import { observeAuth } from "./firebase/auth";
import { setupPresence } from "./firebase/presence";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const handleLike = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.name === product.name);
      return exists
        ? prev.filter((p) => p.name !== product.name)
        : [...prev, product];
    });
  };

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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Header wishlistCount={wishlist.length} />

      <Routes>
        {/* Հանրային էջեր */}
        <Route path="/" element={<Home />} />
        <Route path="/design" element={<Design />} />
        <Route path="/dizayner" element={<Dizayner />} />
        <Route path="/kap" element={<Kap />} />
        <Route path="/mermasin" element={<Mermasin />} />
        <Route path="/xanut" element={<Xanut onLike={handleLike} />} />
        <Route path="/like" element={<Like wishlist={wishlist} />} />
        <Route path="/project/:id" element={<Project />} />

        {/* Օգտատիրոջ պրոֆիլի էջ */}
        <Route path="/profile/:uid" element={user ? <UserProfile /> : <Navigate to="/login" />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/chat" />}
        />

        {/* --- ԿԱՐԵՎՈՐ ՓՈՓՈԽՈՒԹՅՈՒՆՆԵՐԸ ԱՅՍՏԵՂ --- */}
        
        {/* Ընդհանուր չատ (Main Chat) */}
        <Route
          path="/chat"
          element={user ? <Chat user={user} /> : <Navigate to="/login" />}
        />

        {/* Անձնական չատ կոնկրետ մարդու հետ (Private Chat) */}
        <Route
          path="/chat/:chatId"
          element={user ? <Chat user={user} /> : <Navigate to="/login" />}
        />

        {/* Եթե URL-ը սխալ է */}
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