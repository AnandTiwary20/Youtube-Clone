import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";

export default function App() {
  return (
    <h1 className="text-5xl text-blue-600 text-center font-extrabold mt-10">
      🎉 Tailwind v4 Working!
    </h1>
  );
}


// function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <main className="py-6 px-4 md:px-8">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/video/:id" element={<VideoPlayer />} />
//             <Route path="/channel/:id" element={<ChannelPage />} />
//           </Routes>
//         </main>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
