import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Api";

const SearchProduct = createContext();

export const SearchProductProvider = ({ children }) => {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [originalProducts, setOriginalProducts] = useState([]);

    // Hàm tìm kiếm
    const handleSearch = async () => {
        if (search.trim().length <= 2) return;

        setLoading(true);
        try {
            const [brandRes, categoryRes] = await Promise.all([
                axios.get(`${api}searchBrand?q=${search}`),
                axios.get(`${api}searchCategory?q=${search}`)
            ]);

            // Gộp dữ liệu từ cả hai API
            const mergedData = [...brandRes.data.data, ...categoryRes.data.data];

            setProducts(mergedData);
            setOriginalProducts(mergedData);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(handleSearch, 500);

        return () => clearTimeout(delaySearch);
    }, [search]);

    return (
        <SearchProduct.Provider value={{ products, loading, setSearch, search, setProducts, originalProducts }}>
            {children}
        </SearchProduct.Provider>
    );
};

export const useSearch = () => useContext(SearchProduct);
