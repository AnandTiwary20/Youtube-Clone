import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";       
import "./styles/Layout.css";    
import Search from "./pages/Search"; 
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CreateChannel from "./pages/CreateChannel.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";
import Upload from "./pages/Upload";
import EditVideo from "./pages/EditVideo.jsx";



// ---------------- PROTECTED ROUTE ----------------
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// ---------------- APP COMPONENT ----------------
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);   

  return (
    <BrowserRouter>
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} />

        <main className="main-content">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/create-channel" element={<ProtectedRoute><CreateChannel/></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload/></ProtectedRoute>} />
            <Route path="/edit-video/:id" element={<ProtectedRoute><EditVideo/></ProtectedRoute>} />
              <Route path="/search" element={<Search />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
