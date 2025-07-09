import { BrowserRouter, Route, Routes } from "react-router";
import AuthProvider from "./contexts/AuthContext";
import ChatProvider from "./contexts/ChatContext";
import SocketProvider from "./contexts/SocketContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <SocketProvider>
            <div className="h-screen overflow-hidden flex flex-col">
              <Navbar />
              <div className="flex-1 overflow-hidden">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </div>
            </div>
          </SocketProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
