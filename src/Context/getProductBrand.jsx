import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Api";

const GetProductBrand = createContext();

export const GetProductBrandProvider = ({children}) => {
    const [products, setProducts] = useState([]);
    const [brand_id, setId_brand] = useState(null);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true);
    const [originalProducts, setOriginalProducts] = useState([]) 

    const fetchProductBrand = async (brand_id) => {
        try {
            setLoading(true)
            const res = await axios.get(api + `brand/${brand_id}/product`);
            setProducts(res.data.data); 
            setOriginalProducts(res.data.data)
        } catch (error) {
            setError('Không thể tải sản phẩm.');
            console.error(error);
        } finally {
            setLoading(false)
        }
    }; 

    useEffect(() => {
        if (brand_id) {
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
        <GetProductBrand.Provider value={{ products, error, setId_brand, loading, originalProducts, setProducts }} >
            {children}
        </GetProductBrand.Provider>
    );
}

export const useDataBanrd = () => useContext(GetProductBrand);
