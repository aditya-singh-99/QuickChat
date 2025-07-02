import { BrowserRouter, Route, Routes } from "react-router"
import AuthProvider from "./contexts/authContext"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import ChatProvider from "./contexts/chatContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <div className="h-screen overflow-hidden flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
