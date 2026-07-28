import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Bicycles.css'; // Reusing bicycle CSS for grid layout

const Gear = () => {
    const [gear, setGear] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchGear();
    }, []);

    const fetchGear = async () => {
        try {
            const res = await axios.get('/api/inventory', { withCredentials: true });
            setGear(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleRent = async (itemId) => {
        try {
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 7);
            await axios.post('/api/bookings', { itemId, returnDate: returnDate.toISOString().split('T')[0] }, { withCredentials: true });
            alert('Gear rented successfully!');
            fetchGear();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to rent gear');
        }
    };

    const handleDelete = (id) => {
        if(!window.confirm("Delete this gear?")) return;
        setGear(gear.filter(g => g._id !== id));
        alert("Gear deleted!");
    };

    const handleAdd = () => {
        const itemName = prompt("Enter new gear name (e.g. Soldering Iron):");
        if(itemName) {
            const newItem = { _id: Date.now().toString(), itemName, category: 'Tools', description: 'New gear added by admin', availableQuantity: 5, totalQuantity: 5, rentalPricePerDay: 10 };
            setGear([...gear, newItem]);
            alert("Gear added!");
        }
    };

    if (loading) return <div className="page"><h1>Loading Gear...</h1></div>;

    return (
        <div className="page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Rent Gear & Tools</h1>
                    <p style={{ fontWeight: 'bold' }}>Equip yourself for any project or adventure. ({gear.length} items available)</p>
                </div>
                {user?.role === 'admin' && (
                    <button className="btn success" onClick={handleAdd}>+ Add Gear</button>
                )}
            </div>

            <div className="grid-list">
                {gear.map(item => (
                    <div className="item-card" key={item._id}>
                        <img 
                            src={item.image || `https://placehold.co/400x250/222222/FFFFFF?text=${encodeURIComponent(item.itemName)}`} 
                            alt={item.itemName} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                            onError={(e) => { e.target.src = `https://placehold.co/400x250/222222/FFFFFF?text=${encodeURIComponent(item.itemName)}`; }}
                        />
                        <div className="card-details" style={{ textAlign: 'left' }}>
                            <h3 style={{ fontWeight: 'bold' }}>{item.itemName}</h3>
                            <p style={{ fontWeight: 'bold' }}>{item.description}</p>
                            <div className="tags">
                                <span className={item.availableQuantity > 0 ? "tag success" : "tag danger"}>
                                    {item.availableQuantity} / {item.totalQuantity} Available
                                </span>
                                <span className="tag outline">₹{item.rentalPricePerDay}/day</span>
                            </div>
                        </div>
                        <div className="card-actions">
                            {user?.role === 'admin' ? (
                                <button className="btn danger full-width" onClick={() => handleDelete(item._id)}>Delete</button>
                            ) : (
                                <button 
                                    className="btn primary full-width" 
                                    onClick={() => handleRent(item._id)}
                                    disabled={item.availableQuantity < 1}
                                >
                                    {item.availableQuantity > 0 ? 'Rent Now' : 'Out of Stock'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gear;
