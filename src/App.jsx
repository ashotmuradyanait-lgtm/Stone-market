import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Kap from "./pages/Kap.jsx";
import Mermasin from "./pages/Mermasin.jsx";
import Design from "./pages/Design.jsx"
import Home from "./pages/Home.jsx";
import Dizayner from "./pages/Dizayner.jsx"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dizayner" element={<Dizayner />} />
        <Route path="/kap" element={<Kap />} />
        <Route path="/design" element={<Design />} />
        <Route path="/mermasin" element={<Mermasin />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
