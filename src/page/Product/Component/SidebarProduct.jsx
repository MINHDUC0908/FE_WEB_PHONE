import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../../Context/DataContext";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { formatPrice } from "../../../Api";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";

function SiderBarProduct( {setProducts, originalProducts }) {
    const { category, groupedBrands } = useData();
    const [open, setOpen] = useState(null);
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  
    // Lưu giá trị thực tế của thanh trượt
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });

  
    // Giới hạn giá trị thanh trượt
    const [priceLimit, setPriceLimit] = useState({
        min: 0,
        max: 100000000
    });

    // Khởi tạo giá trị từ dữ liệu sản phẩm
    useEffect(() => {
        if (originalProducts && originalProducts.length > 0) {
            // Tìm giá thấp nhất và cao nhất từ sản phẩm
            const minProductPrice = Math.min(...originalProducts.map(p => p.price));
            const maxProductPrice = Math.max(...originalProducts.map(p => p.price));
        
            // Cập nhật giới hạn
            setPriceLimit({
                min: minProductPrice,
                max: maxProductPrice
            });
        
            // Cập nhật giá trị mặc định nếu chưa có
            if (!minPrice || minPrice.price === null) {
                setMinPrice({ price: minProductPrice });
                setPriceRange(prev => ({ ...prev, min: minProductPrice }));
            } else {
                setPriceRange(prev => ({ ...prev, min: minPrice.price }));
            }
            
            if (!maxPrice || maxPrice.price === null) {
                setMaxPrice({ price: maxProductPrice });
                setPriceRange(prev => ({ ...prev, max: maxProductPrice }));
            } else {
                setPriceRange(prev => ({ ...prev, max: maxPrice.price }));
            }
        }
    }, [originalProducts]);

    const toggleCategory = (categoryName) => {
        setOpen((prev) => (prev === categoryName ? null : categoryName));
    };

    const handlePriceChange = (price) => {
        setSelectedPrice(price);
        
        let filteredProducts = originalProducts;
        let newMinPrice = priceLimit.min;
        let newMaxPrice = priceLimit.max;

        switch (price) {
            case "Dưới 10 triệu":
                filteredProducts = originalProducts.filter((p) => p.price < 10000000);
                newMaxPrice = 10000000;
            break;
            case "Từ 10 - 15 triệu":
                filteredProducts = originalProducts.filter((p) => p.price >= 10000000 && p.price <= 15000000);
                newMinPrice = 10000000;
                newMaxPrice = 15000000;
            break;
            case "Từ 15 - 20 triệu":
                filteredProducts = originalProducts.filter((p) => p.price >= 15000000 && p.price <= 20000000);
                newMinPrice = 15000000;
                newMaxPrice = 20000000;
            break;
            case "Từ 20 - 25 triệu":
                filteredProducts = originalProducts.filter((p) => p.price >= 20000000 && p.price <= 25000000);
                newMinPrice = 20000000;
                newMaxPrice = 25000000;
            break;
            case "Từ 25 - 30 triệu":
                filteredProducts = originalProducts.filter((p) => p.price >= 25000000 && p.price <= 30000000);
                newMinPrice = 25000000;
                newMaxPrice = 30000000;
            break;
            case "Trên 30 triệu":
                filteredProducts = originalProducts.filter((p) => p.price > 30000000);
                newMinPrice = 30000000;
            break;
            default:
                filteredProducts = originalProducts;
                newMinPrice = priceLimit.min;
                newMaxPrice = priceLimit.max;
        }
        // Cập nhật lại cả thanh trượt và filter
        setMinPrice({ price: newMinPrice });
        setMaxPrice({ price: newMaxPrice });
        setPriceRange({ min: newMinPrice, max: newMaxPrice });
        
        window.scrollTo(0, 0);
        setProducts(filteredProducts);
    };

    // Xử lý khi người dùng thay đổi giá tối thiểu
    const handleMinPriceChange = (e) => {
        const value = Number(e.target.value);
        // Đảm bảo min không vượt quá max
        if (value <= priceRange.max) {
            setPriceRange(prev => ({ ...prev, min: value }));
        }
    };

    // Xử lý khi người dùng thay đổi giá tối đa
    const handleMaxPriceChange = (e) => {
        const value = Number(e.target.value);
        // Đảm bảo max không nhỏ hơn min
        if (value >= priceRange.min) {
            setPriceRange(prev => ({ ...prev, max: value }));
        }
    };

    // Áp dụng bộ lọc khoảng giá
    const applyPriceRange = () => {
        setSelectedPrice("Tùy chỉnh");
        
        // Cập nhật state trong context
        setMinPrice({ price: priceRange.min });
        setMaxPrice({ price: priceRange.max });
        
        // Lọc sản phẩm
        const filteredProducts = originalProducts.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
        window.scrollTo(0, 0);
        setProducts(filteredProducts);
    };

    // Tính phần trăm cho thanh trượt
    const calculateLeftPosition = () => {
        return ((priceRange.min - priceLimit.min) / (priceLimit.max - priceLimit.min)) * 100;
    };
  
    const calculateRightPosition = () => {
        return 100 - ((priceRange.max - priceLimit.min) / (priceLimit.max - priceLimit.min)) * 100;
    };

    // Tính bước step tối ưu cho thanh trượt
    const getOptimalStep = () => {
        const range = priceLimit.max - priceLimit.min;
        
        if (range <= 1000000) return 100000; // <1tr: step 100k
        if (range <= 10000000) return 500000; // <10tr: step 500k
        if (range <= 100000000) return 1000000; // <100tr: step 1tr
        
        return Math.max(1, Math.floor(range / 100));
    };
    const handleBrand = (brand_id, brand_name, category_name, category_id) => {
        console.log("Brand ID:", brand_id);
        console.log("Brand Name:", brand_name); 
        
        if (brand_name) {
            sessionStorage.setItem('id_brand', brand_id);
            sessionStorage.setItem('brandData', brand_name);
            sessionStorage.setItem('id_category', category_id);
            sessionStorage.setItem('category', category_name);
        }
    };
    return (
        <div className="col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-5 hidden lg:block sticky top-4 h-fit overflow-y-auto">
            {/* PHẦN TIÊU ĐỀ DANH MỤC */}
            <h2 className="text-lg font-bold text-blue-700 mb-5 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">📂</span>
                Danh mục sản phẩm
            </h2>
            
            {/* DANH SÁCH DANH MỤC */}
            <div className="space-y-1">
                {category.map((cate) => (
                    <div key={cate.id} className="mb-2">
                        <div
                            className="cursor-pointer flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            onClick={() => toggleCategory(cate.category_name)}
                        >
                            <span className={`font-medium ${open === cate.category_name ? "text-blue-600" : "text-gray-700"}`}>
                                {cate.category_name}
                            </span>
                            {groupedBrands[cate.id]?.length > 0 && (
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: open === cate.category_name ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-center w-6 h-6"
                                >
                                    <IoIosArrowDown
                                        className={
                                            open === cate.category_name
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                        }
                                    />
                                </motion.div>
                            )}
                        </div>
                        <AnimatePresence>
                            {open === cate.category_name && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        duration: Math.min(
                                            0.3 + (groupedBrands[cate.id]?.length || 0) * 0.05,
                                            0.8
                                        ),
                                    }}
                                    className="pl-5 border-l-2 border-blue-100 ml-3 mt-1 space-y-1"
                                >
                                    {groupedBrands[cate.id]?.map((brand) => (
                                        <div
                                            key={brand.brand_id}
                                            className="py-2 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-all duration-200 flex items-center gap-2"
                                        >
                                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                                            <Link
                                                to={`/product-brand/${brand.brand_name}`} 
                                                onClick={() => {
                                                    handleBrand(brand.brand_id, brand.brand_name, cate.category_name, cate.id);
                                                }} 
                                                className="hover:text-primary"
                                            >
                                                {brand.brand_name} 
                                            </Link>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            
            {/* PHẦN BỘ LỌC */}
            <div className="mt-8">
                <h2 className="text-lg font-bold text-blue-700 mb-5 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">💰</span>
                    Bộ lọc tìm kiếm
                </h2>
                
                {/* BỘ LỌC GIÁ */}
                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="bg-gray-100 p-1 rounded-md text-gray-500 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        Chọn mức giá:
                    </h3>
                    
                    {/* DANH SÁCH MỨC GIÁ */}
                    <ul className="text-sm text-gray-700 space-y-2.5 pl-1 mt-4">
                        {[
                        "Tất cả",
                        "Dưới 10 triệu",
                        "Từ 10 - 15 triệu",
                        "Từ 15 - 20 triệu",
                        "Từ 20 - 25 triệu",
                        "Từ 25 - 30 triệu",
                        "Trên 30 triệu",
                        ].map((price, index) => (
                        <li key={index} className="flex items-center gap-2.5">
                            <input
                                type="radio"
                                id={`price-${index}`}
                                name="price-filter"
                                value={price}
                                checked={selectedPrice === price}
                                onChange={() => handlePriceChange(price)}
                                className="cursor-pointer accent-blue-600 w-4 h-4"
                            />
                            <label
                                htmlFor={`price-${index}`}
                                className={`cursor-pointer transition-colors duration-200 ${selectedPrice === price ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
                            >
                                {price}
                            </label>
                        </li>
                        ))}
                    </ul>
                    
                    {/* KHOẢNG GIÁ TÙY CHỌN */}
                    <div className="mt-6 border-t border-gray-100 pt-5">
                        <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="bg-gray-100 p-1 rounded-md text-gray-500 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </span>
                            Khoảng giá tùy chọn:
                        </p>
                        
                        {/* INPUT GIÁ */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={formatPrice(priceRange.min)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200"
                                    placeholder="Tối thiểu"
                                    readOnly
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">₫</span>
                            </div>
                            <span className="text-gray-400">―</span>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={formatPrice(priceRange.max)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 text-center focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200"
                                    placeholder="Tối đa"
                                    readOnly
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">₫</span>
                            </div>
                        </div>
                        
                        {/* SLIDER GIÁ */}
                        <div className="relative w-full h-12 px-2">
                            <div className="absolute w-full h-1.5 bg-gray-200 rounded-full top-5"></div>
                            <div
                                className="absolute h-1.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full top-5"
                                style={{
                                    left: `${calculateLeftPosition()}%`,
                                    right: `${calculateRightPosition()}%`,
                                }}
                            ></div>
                            <div 
                                className="absolute w-6 h-6 bg-white rounded-full border-2 border-blue-500 top-2.5 -ml-3 cursor-pointer shadow-md z-10 flex items-center justify-center hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                                style={{ left: `${calculateLeftPosition()}%` }}
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <div 
                                className="absolute w-6 h-6 bg-white rounded-full border-2 border-blue-500 top-2.5 -mr-3 cursor-pointer shadow-md z-10 flex items-center justify-center hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                                style={{ right: `${calculateRightPosition()}%` }}
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <input
                                type="range"
                                min={priceLimit.min}
                                max={priceLimit.max}
                                step={getOptimalStep()}
                                value={priceRange.min}
                                onChange={handleMinPriceChange}
                                className="absolute w-full h-12 appearance-none bg-transparent opacity-0 cursor-pointer z-20"
                            />
                            <input
                                type="range"
                                min={priceLimit.min}
                                max={priceLimit.max}
                                step={getOptimalStep()}
                                value={priceRange.max}
                                onChange={handleMaxPriceChange}
                                className="absolute w-full h-12 appearance-none bg-transparent opacity-0 cursor-pointer z-20"
                            />
                        </div>
                        
                        {/* MIN MAX LABELS */}
                        <div className="flex justify-between mt-1.5 text-xs text-gray-500 px-1.5">
                            <span>{formatPrice(priceLimit.min) + "₫"}</span>
                            <span>{formatPrice(priceLimit.max) + "₫"}</span>
                        </div>
                        
                        {/* BUTTON ÁP DỤNG */}
                        <button 
                            onClick={applyPriceRange} 
                            className="group mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-blue-200 relative overflow-hidden py-2.5"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                <FiFilter className="text-lg" />
                                <span className="relative">
                                    Áp dụng bộ lọc
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SiderBarProduct;