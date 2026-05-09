import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import Profile from "./pages/Profile";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#CAFF00]/10 flex items-center justify-center text-2xl">✦</div>
      <h1 className="text-4xl font-black tracking-tight">404</h1>
      <p className="text-white/30 text-sm">This page doesn't exist.</p>
      <a href="/dashboard" className="text-[#CAFF00] text-sm hover:underline">
        Go to Dashboard →
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/notes/new" element={<PrivateRoute><NoteEditor /></PrivateRoute>} />
            <Route path="/notes/:id/edit" element={<PrivateRoute><NoteEditor /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;