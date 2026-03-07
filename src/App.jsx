import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Dizaynerner from "./pages/Dizaynerner.jsx"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dizaynerner" element={<Dizaynerner />} />
      </Routes>
    </>
  );
}

export default App;
