import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/bookings/my', { withCredentials: true });
            setBookings(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleReturn = async (booking) => {
        try {
            if (booking.itemType === 'Bicycle') {
                await axios.post('/api/bicycles/return', { bicycleId: booking.itemId }, { withCredentials: true });
            } else {
                await axios.post('/api/bookings/return', { bookingId: booking._id }, { withCredentials: true });
            }
            alert('Item returned successfully!');
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to return');
        }
    };

    if (loading) return <div className="page"><h1>Loading Bookings...</h1></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>My Bookings</h1>
                <p>Manage your active rentals here.</p>
            </div>

            <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.length === 0 ? <p>No active bookings found.</p> : null}
                {bookings.map(bk => (
                    <div key={bk._id} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{bk.itemType} Rental</h3>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Status: <span style={{ color: bk.bookingStatus === 'active' ? 'var(--primary)' : 'var(--success)' }}>{bk.bookingStatus.toUpperCase()}</span></p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Return By: {new Date(bk.returnDate).toLocaleDateString()}</p>
                        </div>
                        {bk.bookingStatus === 'active' && (
                            <button className="btn primary" onClick={() => handleReturn(bk)}>Return Item</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookings;
