import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const GetProductCategory = createContext();

export const GetProductCategoryProvider = ({ children }) => {
    const [getProduct, setProducts] = useState([]);  
    const [error, setError] = useState('');
    const [id, setId] = useState(null)
    const fetchProductCategory = async (id) => {
        try {
            const res = await axios.get(`https://duc-phone.onrender.com/api/category/${id}/product`);
            setProducts(res.data.data);
        } catch (error) {
            setError('Không thể tải sản phẩm.');
        }
    };
    useEffect(() => {
        if (id) {
            fetchProductCategory(id);
        }
    }, [id]);
    return (
        <GetProductCategory.Provider value={{ getProduct, error, setId }}>
            {children}
        </GetProductCategory.Provider>
    );
};

// Hook để sử dụng dữ liệu từ context
export const useDataGetProduct = () => useContext(GetProductCategory);
