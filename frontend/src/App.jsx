import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Feedback from './pages/Feedback';
import Login from './pages/Login';
import Register from './pages/Register';
import Politicians from './pages/Politicians';
import PoliticianDetail from './pages/PoliticianDetail';
import { AuthContext } from './utils/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/politicians" element={<ProtectedRoute><Politicians /></ProtectedRoute>} />
        <Route path="/politician-detail" element={<ProtectedRoute><PoliticianDetail /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
