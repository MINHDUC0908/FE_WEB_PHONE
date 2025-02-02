import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const GetProductBrand = createContext();

export const GetProductBrandProvider = ({children}) => {
    const [products, setProduct] = useState([]);
    const [brand_id, setId_brand] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); 

    const fetchProductBrand = async (brand_id) => {
        try {
            const res = await axios.get(`https://duc-phone.onrender.com/api/brand/${brand_id}/product`);
            setProduct(res.data.data); 
        } catch (error) {
            setError('Không thể tải sản phẩm.');
            console.error(error);
        }
    };

    useEffect(() => {
        if (brand_id) {
            setLoading(true);
            fetchProductBrand(brand_id);
        }
    }, [brand_id]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); 
        }, 1000);
        return () => clearTimeout(timer);
    }, [loading]);

    return (
        <GetProductBrand.Provider value={{ products, error, setId_brand, loading }} >
            {children}
        </GetProductBrand.Provider>
    );
}

export const useDataBanrd = () => useContext(GetProductBrand);
