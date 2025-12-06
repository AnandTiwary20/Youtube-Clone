import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
