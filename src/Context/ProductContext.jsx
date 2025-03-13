import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [minPrice, setMinPrice] = useState(null)
    const [maxPrice, setMaxPrice] = useState(null)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [product, setProduct] = useState('');
    const [id_product, setId_product] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);


    const fetchProducts = async () => {
        try {
            const res = await axios.get(api + 'product');
            return res.data;
        } catch (error) {
            console.log('Error fetching products:', error);
            return { error: 'Unable to load products' };
        }
    };

    const fetchDataProducts = async () => {
        setLoading(true);
        try {
            const result = await fetchProducts();
            if (result.error) {
                setError(result.error);
                setSuccess('');
            } else {
                setProducts(result.data);
                setOriginalProducts(result.data);
                setMinPrice(result.min)
                setMaxPrice(result.max)
                setSuccess(result.message || 'Products loaded successfully');
                setError('');
            }
        } catch (error) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchDataProducts();
    }, []);

    const fetchProductShow = async (id_product) => {
        try {
            const res = await axios.get(api + `product/${id_product}`);
            setProduct(res.data.data);
            setRelatedProducts(res.data.related_products);
        } catch (error) {
            console.log('Error fetching product:', error);
            return { error: 'Unable to load product' };
        }
    };

    // useEffect(() => {
    //     if (id_product) {
    //         fetchProductShow(id_product);
    //     }
    // }, [id_product]);

    return (
        <ProductContext.Provider value={{ products, setProducts, loading, error, success, product, setId_product, relatedProducts, originalProducts, minPrice, maxPrice, setMinPrice, setMaxPrice, id_product, setProduct, fetchProductShow }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useDataProduct = () => useContext(ProductContext);
