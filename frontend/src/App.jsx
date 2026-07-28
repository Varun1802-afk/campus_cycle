import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bicycles from './pages/Bicycles';

import Gear from './pages/Gear';
import Marketplace from './pages/Marketplace';
import Bookings from './pages/Bookings';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return (
        <div className="app-container grid-bg">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/bicycles" element={<ProtectedRoute><Bicycles /></ProtectedRoute>} />
                <Route path="/gear" element={<ProtectedRoute><Gear /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
