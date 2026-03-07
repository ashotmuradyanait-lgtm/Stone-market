import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Kap from "./pages/Kap.jsx";
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
