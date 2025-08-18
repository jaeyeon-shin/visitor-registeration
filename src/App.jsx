import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CardUpload from "./pages/CardUpload";
import ManualForm from "./pages/ManualForm";
import Success from "./pages/Success";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/card" element={<CardUpload />} />
      <Route path="/manual" element={<ManualForm />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default App;
