import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async (token) => {
        try {
            setLoading(true);
            const res = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data);
        } catch (err) {
            setError('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        try {
            // 1. Đăng nhập để lấy token
            const loginRes = await axios.post('http://127.0.0.1:8000/api/login', formData);
            const { token } = loginRes.data;
            
            // 2. Lưu token vào localStorage
            localStorage.setItem('token', token);
            
            // 3. Ngay lập tức gọi API lấy thông tin user
            const userRes = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            // 4. Set user với đầy đủ thông tin
            setUser(userRes.data);
        } catch (err) {
            throw err;
        }
    };
    const logout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                localStorage.removeItem("token");
                setUser(null);
            } catch (error) {
                console.error("Logout failed:", error);
            }
        } else {
            navigate("/login");
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const UseDataUser = () => useContext(UserContext);