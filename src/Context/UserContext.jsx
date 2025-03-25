import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../Api";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async (token) => {
        try {
            setLoading(true);
            const res = await axios.get(api + "user-profile/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data) {
                setUser(res.data);
            } else {
                throw new Error("User data is null");
            }
        } catch (err) {
            setError("Failed to fetch user data");
            localStorage.removeItem("token"); // Xóa token nếu không thể lấy user
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        try {
            // 1. Đăng nhập để lấy token
            const loginRes = await axios.post(api + "login", formData);
            const { token } = loginRes.data;

            // 2. Lưu token vào localStorage
            localStorage.setItem("token", token);

            // 3. Ngay lập tức gọi API lấy thông tin user
            fetchUser(token);
        } catch (err) {
            throw err;
        }
    };

    const logout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await axios.post(api + "logout", {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
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
