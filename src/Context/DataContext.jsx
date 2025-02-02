import { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from 'axios';
const DataContext = createContext();
import { api } from "../Api";

export const DataProvider = ({ children }) => {
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategory = async () => {
        try {
            const res = await axios.get(api + 'categories');
            return res.data;
        } catch (error) {
            console.log('Error fetching category:', error);
            return { error: 'Unable to load categories' };
        }
    };

    const fetchBrand = async () => {
        try {
            const res = await axios.get( api + 'brands');
            return res.data;
        } catch (error) {
            console.log('Error fetching brands:', error);
            return { error: 'Unable to load brands' };
        }
    };
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [categoryResult, brandResult] = await Promise.all([fetchCategory(), fetchBrand()]);

            if (categoryResult.data) {
                setCategory(categoryResult.data);
            } else {
                setError(categoryResult.error);
            }

            if (brandResult.data) {
                setBrand(brandResult.data);
            } else {
                setError(brandResult.error);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError('An error occurred while fetching data');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const groupedBrands = useMemo(() => {
        return brand.reduce((acc, item) => {
            const { category_id, brand_name, id: brand_id } = item;
            if (!acc[category_id]) {
                acc[category_id] = [];
            }
            acc[category_id].push({ brand_id, brand_name, });
            return acc;
        }, {});
    }, [brand]);
    return (
        <DataContext.Provider value={{ category, brand, groupedBrands, error, isLoading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);