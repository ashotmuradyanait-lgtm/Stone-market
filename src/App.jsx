import { Routes, Route } from "react-router-dom";
import { useState } from "react"; 

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
import Project1 from "./designs/Project.jsx";

function App() {
  const [wishlist, setWishlist] = useState([]);

  const handleLike = (product) => {
    setWishlist((prev) => {
      const isExist = prev.find((item) => item.name === product.name);
      if (isExist) {
        return prev.filter((item) => item.name !== product.name); 
      } else {
        return [...prev, product]; 
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
        <Route 
          path="/xanut" 
          element={<Xanut onLike={handleLike} wishlist={wishlist} />} 
        />
        
        <Route 
          path="/like" 
          element={<Like wishlist={wishlist} onLike={handleLike} />} 
        />
        <Route path="/project/:id" element={<Project1 />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
