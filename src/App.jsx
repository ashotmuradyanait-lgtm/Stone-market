import { Routes, Route } from "react-router-dom";
import { useState } from "react"; // Ավելացրինք սա

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Chat from "./components/Chat.jsx";
import Kap from "./pages/Kap.jsx";
import Xanut from "./pages/Xanut.jsx";
import Like from "./pages/Like.jsx";
import Mermasin from "./pages/Mermasin.jsx";
import Design from "./pages/Design.jsx";
import Home from "./pages/Home.jsx";
import Dizayner from "./pages/Dizayner.jsx";

function App() {
  // 1. Ստեղծում ենք wishlist-ը այստեղ
  const [wishlist, setWishlist] = useState([]);

  // 2. Ֆունկցիա՝ սրտիկին սեղմելու համար
  const handleLike = (product) => {
    setWishlist((prev) => {
      const isExist = prev.find((item) => item.name === product.name);
      if (isExist) {
        return prev.filter((item) => item.name !== product.name); // Հեռացնել
      } else {
        return [...prev, product]; // Ավելացնել
      }
    });
  };

  return (
    <>
      {/* Header-ին տալիս ենք քանակը */}
      <Header wishlistCount={wishlist.length} />
      <Chat />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dizayner" element={<Dizayner />} />
        <Route path="/kap" element={<Kap />} />
        <Route path="/design" element={<Design />} />
        <Route path="/mermasin" element={<Mermasin />} />
        
        {/* Xanut-ին տալիս ենք ֆունկցիան ու ցուցակը */}
        <Route 
          path="/xanut" 
          element={<Xanut onLike={handleLike} wishlist={wishlist} />} 
        />
        
        {/* Like էջին տալիս ենք հենց wishlist-ը, որ ցույց տա ընտրվածները */}
        <Route 
          path="/like" 
          element={<Like wishlist={wishlist} onLike={handleLike} />} 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
