import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CreateChannel from "./pages/CreateChannel.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";
import Upload from "./pages/Upload";
import "./styles/Layout.css";  
import EditVideo from "./pages/EditVideo.jsx";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-container">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
           < Route path="/create-channel" element={<ProtectedRoute><CreateChannel/></ProtectedRoute>} />
<Route path="/edit-video/:id" element={<ProtectedRoute><EditVideo/></ProtectedRoute>} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/upload" element={<ProtectedRoute><Upload/></ProtectedRoute>} />
            <Route path="/edit-video/:id" element={<EditVideo />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
