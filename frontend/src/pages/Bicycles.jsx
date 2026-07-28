import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Bicycles = () => {
    const [bicycles, setBicycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchBicycles = async () => {
            try {
                const res = await axios.get('/api/bicycles');
                if (res.data.success) {
                    setBicycles(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching bicycles", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBicycles();
    }, []);

    const handleRent = async (id) => {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 1); // rent for 1 day default
        
        try {
            await axios.post('/api/bicycles/rent', { bicycleId: id, returnDate }, { withCredentials: true });
            alert("Bicycle rented successfully!");
            const res = await axios.get('/api/bicycles');
            setBicycles(res.data.data);
        } catch (err) {
            alert(err.response?.data?.error || "Error renting bicycle");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this bicycle?")) return;
        // In-memory delete simulation
        setBicycles(bicycles.filter(b => b._id !== id));
        alert("Bicycle deleted!");
    };

    const handleAdd = () => {
        const bicycleId = prompt("Enter Bicycle ID (e.g., B-NEW-01):");
        if(bicycleId) {
            const newBike = { _id: Date.now().toString(), bicycleId, condition: 'Excellent', status: 'available', rentalPrice: 50 };
            setBicycles([...bicycles, newBike]);
            alert("Bicycle added!");
        }
    };

    return (
        <div className="page-container">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Rent a Bicycle</h1>
                    <p>Browse available bicycles on campus.</p>
                </div>
                {user?.role === 'admin' && (
                    <button className="btn success" onClick={handleAdd}>+ Add Bicycle</button>
                )}
            </header>

            {loading ? (
                <p>Loading bicycles...</p>
            ) : (
                <div className="grid-list">
                    {bicycles.map(bike => (
                        <div key={bike._id} className="card item-card">
                            <img 
                                src={bike.image || `https://placehold.co/400x250/222222/FFFFFF?text=Bicycle`} 
                                alt={bike.bicycleId} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                onError={(e) => { e.target.src = `https://placehold.co/400x250/222222/FFFFFF?text=${encodeURIComponent(bike.bicycleId)}`; }}
                            />
                            <div className="card-content" style={{ textAlign: 'left' }}>
                                <h3 style={{ fontWeight: 'bold' }}>{bike.condition} Condition</h3>
                                <p className="price" style={{ fontWeight: 'bold' }}>₹{bike.rentalPrice} / day</p>
                                <div className="status-badge" data-status={bike.status}>{bike.status}</div>
                                
                                {user?.role === 'admin' ? (
                                    <button className="btn danger w-100" onClick={() => handleDelete(bike._id)}>Delete</button>
                                ) : (
                                    bike.status === 'available' && (
                                        <button className="btn btn-primary w-100" onClick={() => handleRent(bike._id)}>Rent Now</button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                    {bicycles.length === 0 && <p>No bicycles found.</p>}
                </div>
            )}
        </div>
    );
};

export default Bicycles;
