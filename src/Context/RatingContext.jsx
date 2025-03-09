import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Api";

// Tạo context cho Rating
const RatingContext = createContext();

export const RatingProvider = ({ children }) => {
    const [product_id, setProduct_id] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hàm lấy dữ liệu đánh giá
    const fetchRatings = async (product_id) => {
        if (!product_id) return;
        setLoading(true);
        try {
            const response = await axios.get(`${api}rating?product_id=${product_id}`);
            setRatings(response.data?.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi product_id thay đổi
    useEffect(() => {
        fetchRatings(product_id);
    }, [product_id]);

    return (
        <RatingContext.Provider value={{ fetchRatings, ratings, loading, setProduct_id }}>
            {children}
        </RatingContext.Provider>
    );
};

// Hook để sử dụng RatingContext
export const useRating = () => useContext(RatingContext);
