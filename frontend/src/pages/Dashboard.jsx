import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeBookings: 0,
        myListings: 0,
        unreadNotifications: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [bookingsRes, notificationsRes, marketplaceRes] = await Promise.all([
                    axios.get('/api/bookings/my'),
                    axios.get('/api/notifications'),
                    axios.get('/api/marketplace')
                ]);
                
                const activeBookings = bookingsRes.data.data.filter(b => b.bookingStatus === 'active').length;
                const unreadNotifs = notificationsRes.data.data.filter(n => !n.readStatus).length;
                const myListingsCount = marketplaceRes.data.data.filter(m => m.sellerId === user._id).length;
                
                setStats({
                    activeBookings,
                    myListings: myListingsCount,
                    unreadNotifications: unreadNotifs
                });
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="page-header">
                <div>
                    <h1>Welcome back, {user?.fullName.split(' ')[0]}</h1>
                    <p>Here is what's happening today.</p>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card card">
                    <h3>Active Bookings</h3>
                    <div className="stat-value text-accent">{stats.activeBookings}</div>
                </div>
                <div className="stat-card card">
                    <h3>My Marketplace Listings</h3>
                    <div className="stat-value">{stats.myListings}</div>
                </div>
                <div className="stat-card card">
                    <h3>Unread Notifications</h3>
                    <div className="stat-value">{stats.unreadNotifications}</div>
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="quick-actions" style={{ marginTop: '2rem' }}>
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button className="btn btn-primary" onClick={() => window.location.href='/bicycles'}>Rent Bicycle</button>
                    <button className="btn outline" onClick={() => window.location.href='/gear'}>Rent Gear</button>
                    <button className="btn outline" onClick={() => window.location.href='/marketplace'}>Sell Item</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
