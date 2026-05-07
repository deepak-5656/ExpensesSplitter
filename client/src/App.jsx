import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

import { Suspense, lazy } from 'react';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PersonalExpenses = lazy(() => import('./pages/PersonalExpenses'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupDetail = lazy(() => import('./pages/GroupDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const JoinGroup = lazy(() => import('./pages/JoinGroup'));
const Profile = lazy(() => import('./pages/Profile'));

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center space-x-2">
    <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"></div>
    <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111] antialiased">
      <Sidebar />
      <main className="md:ml-64 min-h-screen border-l border-slate-100 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/personal" element={<ProtectedRoute><PersonalExpenses /></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
          <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
          <Route path="/join/:token" element={<JoinGroup />} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
