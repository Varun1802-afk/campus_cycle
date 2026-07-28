import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Bicycles.css';

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSellForm, setShowSellForm] = useState(false);
    const [sellFormData, setSellFormData] = useState({ title: '', category: 'General', price: '', description: '', image: '' });
    const { user } = useAuth();

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await axios.get('/api/marketplace', { withCredentials: true });
            setListings(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if(!window.confirm("Remove this listing?")) return;
        setListings(listings.filter(m => m._id !== id));
        alert("Listing removed!");
    };

    const handleAdd = () => {
        const title = prompt("Enter listing title (e.g. Physics Textbook):");
        if(title) {
            const newItem = { _id: Date.now().toString(), title, category: 'General', description: 'Added via Admin', price: 100, sellerName: user.fullName };
            setListings([...listings, newItem]);
            alert("Listing added!");
        }
    };

    const handleStudentSellSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/marketplace', sellFormData, { withCredentials: true });
            if (res.data.pending) {
                alert("Listing submitted for Admin approval!");
            } else {
                setListings([...listings, res.data.data]);
                alert("Listing added!");
            }
            setShowSellForm(false);
            setSellFormData({ title: '', category: 'General', price: '', description: '' });
        } catch (err) {
            alert(err.response?.data?.error || "Failed to submit listing");
        }
    };

    if (loading) return <div className="page"><h1>Loading Marketplace...</h1></div>;

    return (
        <div className="page-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Student Marketplace</h1>
                    <p style={{ fontWeight: 'bold' }}>Buy and sell used items securely within the campus. ({listings.length} active listings)</p>
                </div>
                {user?.role === 'admin' ? (
                    <button className="btn success" onClick={handleAdd}>+ Add Listing</button>
                ) : (
                    <button className="btn primary" onClick={() => setShowSellForm(!showSellForm)}>
                        {showSellForm ? 'Cancel' : 'Sell an Item'}
                    </button>
                )}
            </header>

            {showSellForm && (
                <div className="card form-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: 'var(--surface)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
                    <h2 style={{ marginBottom: '2rem', color: 'var(--primary)', textAlign: 'center' }}>Request to List an Item</h2>
                    <form onSubmit={handleStudentSellSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Item Title</label>
                            <input type="text" placeholder="e.g. Physics Textbook" value={sellFormData.title} onChange={e => setSellFormData({...sellFormData, title: e.target.value})} required className="form-control" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-color)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                            <select value={sellFormData.category} onChange={e => setSellFormData({...sellFormData, category: e.target.value})} className="form-control" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-color)' }}>
                                <option value="General">General</option>
                                <option value="Books">Books</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Hobbies">Hobbies</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price (₹)</label>
                            <input type="number" placeholder="0" value={sellFormData.price} onChange={e => setSellFormData({...sellFormData, price: e.target.value})} required className="form-control" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-color)' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Image URL (Optional)</label>
                            <input type="url" placeholder="https://example.com/image.jpg" value={sellFormData.image} onChange={e => setSellFormData({...sellFormData, image: e.target.value})} className="form-control" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-color)' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                            <textarea placeholder="Describe the condition, age, and features of the item..." value={sellFormData.description} onChange={e => setSellFormData({...sellFormData, description: e.target.value})} required className="form-control" rows="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-color)', resize: 'vertical' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '8px' }}>Submit for Approval</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-list">
                {listings.map(item => (
                    <div className="item-card" key={item._id}>
                        <img 
                            src={item.image || `https://placehold.co/400x250/222222/FFFFFF?text=${encodeURIComponent(item.title)}`} 
                            alt={item.title} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = `https://placehold.co/400x250/222222/FFFFFF?text=${encodeURIComponent(item.title)}`; }}
                        />
                        <div className="card-details" style={{ textAlign: 'left' }}>
                            <h3 style={{ fontWeight: 'bold' }}>{item.title}</h3>
                            <p style={{ fontWeight: 'bold' }}>{item.description}</p>
                            <div className="tags">
                                <span className="tag warning">₹{item.price}</span>
                                <span className="tag outline">Seller: {item.sellerName}</span>
                            </div>
                        </div>
                        <div className="card-actions">
                            {user?.role === 'admin' ? (
                                <button className="btn danger full-width" onClick={() => handleDelete(item._id)}>Remove Listing</button>
                            ) : (
                                <button 
                                    className="btn outline full-width" 
                                    onClick={() => alert(`Contact ${item.sellerName} at: ${item.contactInfo}`)}
                                >
                                    Contact Seller
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
