import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { api } from "../Api";

const GetProductCategory = createContext();

export const GetProductCategoryProvider = ({ children }) => {
    const [products, setProducts] = useState([]);  
    const [error, setError] = useState('');
    const [id, setId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [originalProducts, setOriginalProducts] = useState([]);
    const [cache, setCache] = useState({});
    const fetchProductCategory = async (id) => {
        if (cache[id]) {
            setProducts(cache[id]); // Dùng cache nếu có dữ liệu
            return;
        }
    
        try {
            setLoading(true);
            const res = await axios.get(api + `category/${id}/product`);
            if (res.data.data.length > 0) {
                setProducts(res.data.data);
                setOriginalProducts(res.data.data);
                setCache((prev) => ({ ...prev, [id]: res.data.data })); // Lưu vào cache
            }
        } catch (error) {
            setError('Không thể tải sản phẩm.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (id !== null && id !== "") {
            fetchProductCategory(id);
        }
    }, [id]);    
    return (
        <GetProductCategory.Provider value={{ products, error, setId, loading, setProducts, originalProducts }}>
            {children}
        </GetProductCategory.Provider>
    );
};

// Hook để sử dụng dữ liệu từ context
export const useDataGetProduct = () => useContext(GetProductCategory);
