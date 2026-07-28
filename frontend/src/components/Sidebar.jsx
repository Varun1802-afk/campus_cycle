import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar glass">
            <div className="sidebar-logo">
                <Link to="/">CampusCycle</Link>
            </div>
            
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/bicycles">Rent Bicycles</Link></li>
                    <li><Link to="/gear">Rent Gear</Link></li>
                    <li><Link to="/marketplace">Marketplace</Link></li>
                    <li><Link to="/bookings">My Bookings</Link></li>
                    
                    {user?.role === 'admin' && (
                        <>
                            <li className="nav-header">Admin</li>
                            <li><Link to="/admin">Admin Dashboard</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <span className="user-name">{user?.fullName}</span>
                    <span className="user-role">{user?.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline logout-btn">Logout</button>
            </div>
        </aside>
    );
};

export default Sidebar;
