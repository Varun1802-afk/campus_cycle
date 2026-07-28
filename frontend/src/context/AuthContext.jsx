import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup axios defaults
    axios.defaults.withCredentials = true; // IMPORTANT for session cookies

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (identifier, password) => {
        const res = await axios.post('/api/auth/login', { identifier, password });
        setUser(res.data.data);
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post('/api/auth/register', userData);
        setUser(res.data.data);
        return res.data;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
