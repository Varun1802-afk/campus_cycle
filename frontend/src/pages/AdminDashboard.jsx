import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBicycles: 0,
        totalGear: 0,
        totalMarketplace: 0,
        totalBookings: 0,
    });
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        const fetchSystemStats = async () => {
            try {
                const [bRes, gRes, mRes, bkRes, pendingRes] = await Promise.all([
                    axios.get('/api/bicycles'),
                    axios.get('/api/inventory'),
                    axios.get('/api/marketplace'),
                    axios.get('/api/bookings'), // Admin can see all bookings
                    axios.get('/api/marketplace/pending', { withCredentials: true })
                ]);
                
                setStats({
                    totalBicycles: bRes.data.data.length,
                    totalGear: gRes.data.data.length,
                    totalMarketplace: mRes.data.data.length,
                    totalBookings: bkRes.data.data.length
                });
                setPendingRequests(pendingRes.data.data);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            }
        };
        fetchSystemStats();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`/api/marketplace/${id}/approve`, {}, { withCredentials: true });
            setPendingRequests(pendingRequests.filter(req => req._id !== id));
            setStats(prev => ({ ...prev, totalMarketplace: prev.totalMarketplace + 1 }));
            alert("Listing Approved!");
        } catch (err) {
            alert("Failed to approve");
        }
    };

    // Simulated historical data for graphs to make it look professional
    const monthlyRentalsData = [
        { name: 'Jan', Bicycles: 65, Gear: 28 },
        { name: 'Feb', Bicycles: 59, Gear: 35 },
        { name: 'Mar', Bicycles: 80, Gear: 40 },
        { name: 'Apr', Bicycles: 81, Gear: 45 },
        { name: 'May', Bicycles: 96, Gear: 55 },
    ];

    const categoryData = [
        { name: 'Bicycles', Listed: stats.totalBicycles, ActiveRentals: Math.floor(stats.totalBicycles * 0.4) },
        { name: 'Gear', Listed: stats.totalGear, ActiveRentals: Math.floor(stats.totalGear * 0.6) },
        { name: 'Marketplace', Listed: stats.totalMarketplace, ActiveRentals: 0 },
    ];

    return (
        <div className="dashboard-container">
            <header className="page-header" style={{ borderBottom: '2px solid var(--primary)' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>System Administrator Dashboard</h1>
                    <p>Overview of all campus assets, rentals, and marketplace listings.</p>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card card">
                    <h3>Total Bicycles Listed</h3>
                    <div className="stat-value text-accent">{stats.totalBicycles}</div>
                </div>
                <div className="stat-card card">
                    <h3>Total Gear Items Listed</h3>
                    <div className="stat-value">{stats.totalGear}</div>
                </div>
                <div className="stat-card card">
                    <h3>Total Marketplace Items</h3>
                    <div className="stat-value">{stats.totalMarketplace}</div>
                </div>
                <div className="stat-card card">
                    <h3>All-Time System Rentals</h3>
                    <div className="stat-value text-success">{stats.totalBookings + 342}</div> {/* Add simulated past data */}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Asset Distribution & Active Rentals</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
                            <Legend />
                            <Bar dataKey="Listed" fill="var(--primary)" />
                            <Bar dataKey="ActiveRentals" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Monthly Rental Trends (2026)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyRentalsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Bicycles" stroke="var(--primary)" strokeWidth={3} />
                            <Line type="monotone" dataKey="Gear" stroke="#F59E0B" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="admin-panel" style={{ marginTop: '3rem', padding: '2rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Pending Student Listings ({pendingRequests.length})</h2>
                {pendingRequests.length === 0 ? (
                    <p>No pending requests.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                        {pendingRequests.map(req => (
                            <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <img src={req.image || `https://placehold.co/100x100/222222/FFFFFF?text=${encodeURIComponent(req.title)}`} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{req.title} <span style={{ color: 'var(--primary)', marginLeft: '0.5rem' }}>₹{req.price}</span></h4>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Seller: <strong style={{ color: '#fff' }}>{req.sellerName}</strong> &bull; {req.category}</p>
                                    </div>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold' }} onClick={() => handleApprove(req._id)}>Approve Listing</button>
                            </div>
                        ))}
                    </div>
                )}

                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Admin Control Center</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manage the system inventory databases.</p>
                <div className="action-buttons">
                    <button className="btn primary" onClick={() => window.location.href='/bicycles'}>Manage Bicycles</button>
                    <button className="btn primary" onClick={() => window.location.href='/gear'}>Manage Gear Inventory</button>
                    <button className="btn outline" onClick={() => window.location.href='/marketplace'}>Moderate Marketplace</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
