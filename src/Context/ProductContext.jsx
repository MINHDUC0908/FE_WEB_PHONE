import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [product, setProduct] = useState('');
    const [id_product, setId_product] = useState(null);
    const fetchProducts = async () => {
        try {
            const res = await axios.get(api + 'product');
            return res.data.data;
        } catch (error) {
            console.log('Error fetching products:', error);
            return { error: 'Unable to load products' };
        }
    };
    const fetchDataProducts = async () => {
        try {
            const result = await fetchProducts();
            if (result.error) {
                setError(result.error);
                setSuccess('');
            } else {
                setProducts(result); 
                setSuccess(result.message || 'Products loaded successfully');
                setError('');
            }
        } catch (error) {
            setError('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchDataProducts();
    }, []);
    const fetchProductShow = async(id_product) => {
        try {
            const res = await axios.get(api + `product/${id_product}`);
            setProduct(res.data.data);
        } catch (error) {
            console.log('Error fetching product:', error);
            return { error: 'Unable to load product' };
        }
    }
    useEffect(() => {
        if (id_product)
        {
            fetchProductShow(id_product);
        }
    }, [id_product])
    useEffect(() => {
        const times = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(times);
    }, [])
    return (
        <ProductContext.Provider value={{ products, setProducts, loading, error, success, product, setId_product }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useDataProduct = () => useContext(ProductContext);
