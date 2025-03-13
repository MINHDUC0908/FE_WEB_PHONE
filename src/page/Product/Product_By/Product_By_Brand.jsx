import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SortProduct from "../Component/SortProduct";
import SiderBarProduct from "../Component/SidebarProduct";
import { ShoppingCartIcon } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { src } from "../../../Api";
import { IoIosArrowDown } from "react-icons/io";
import { useDataBanrd } from "../../../Context/getProductBrand";
import { useData } from "../../../Context/DataContext";
import { FaShoppingBag } from "react-icons/fa";

function Product_By_Brand({setCurrentTitle}) {
    const location = useLocation();
    const [getBrandName, setBrandName] = useState("");
    const { products, setId_brand, setProducts, originalProducts, loading } = useDataBanrd();
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [imageLoaded, setImageLoaded] = useState({});
    const { category, brand } = useData();
    const [loadedImages, setLoadedImages] = useState({});
    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };
    // Tìm thông tin brand và category với xử lý null safety
    const brandItem = brand && brand.length > 0 ? brand.find(b => b.brand_name === getBrandName) : null;
    const categoryItem = brandItem && category && category.length > 0 ? 
        category.find(c => c.id === brandItem.category_id) : null;

    const updateBrandFromLocalStorage = () => {
        const brandLocal = sessionStorage.getItem("brandData");
        const idLocal = sessionStorage.getItem("id_brand");
        if (brandLocal && idLocal) {
            setBrandName(brandLocal);
            setId_brand(idLocal);
        } else {
            setBrandName("Chọn danh mục");
        }
    };

    // Đồng bộ trạng thái khi route hoặc localStorage thay đổi
    useEffect(() => {
        updateBrandFromLocalStorage();
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (getBrandName) {
            setCurrentTitle(`Product-category: ${getBrandName}`);
        }
    }, [setCurrentTitle, getBrandName]);
    
    // Xử lý tải thêm sản phẩm
    const displayedProducts = products && products.length > 0 ? products.slice(0, visibleProducts) : [];
    const hasMoreProducts = products && visibleProducts < products.length;
    
    const handleLoadMore = () => {
        setVisibleProducts((prev) => prev + 4);
    };
    
    // Xử lý khi click vào sản phẩm
    const handleProduct = (id, productName) => {
        // Lưu ID sản phẩm vào localStorage hoặc thực hiện hành động khác
        sessionStorage.setItem("productId", id);
        sessionStorage.setItem("productName", productName);
    };
    
    // Hiển thị loading
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <FaShoppingBag className="text-blue-500 text-lg" />
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <h1 className="text-black font-semibold flex items-center gap-1">
                    <Link to="/product" className="hover:text-blue-600 transition-colors">
                        Sản phẩm
                    </Link>
                    {categoryItem && (
                        <>
                            <span className="text-gray-400 mx-1">/</span>
                            <Link 
                                to={`/product-category/${encodeURIComponent(categoryItem.category_name)}`}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {categoryItem.category_name}
                            </Link>
                        </>
                    )}
                    {brandItem && (
                        <>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-blue-600">
                                {brandItem.brand_name}
                            </span>
                        </>
                    )}
                    </h1>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
                    {/* Sidebar danh mục */}
                    <SiderBarProduct 
                        setProducts={setProducts} 
                        originalProducts={originalProducts} 
                    />
                    
                    {/* Nội dung sản phẩm */}
                    <div className="col-span-4 lg:col-span-6">
                        {/* Các nút sắp xếp */}
                        <SortProduct 
                            setProducts={setProducts} 
                            originalProducts={originalProducts}
                        />
                        
                        {/* Lưới sản phẩm */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                        whileHover={{ y: -5 }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link
                                            to={`/product/${encodeURIComponent(product.product_name)}`}
                                            onClick={() => handleProduct(product)}
                                            className="block h-full"
                                            state={{id: product.id}}
                                        >
                                            <div className="h-48 md:h-56 lg:h-64 relative overflow-hidden bg-gray-50">
                                                <LazyLoadImage
                                                    src={`${src}imgProduct/${product.images}`}
                                                    alt={product.title}
                                                    className={`w-full h-full object-contain transition-all duration-500 ${
                                                        loadedImages[product.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                    }`}
                                                    onLoad={() => handleImageLoad(product.id)}
                                                    loading="lazy"
                                                />
                                                {/* Discount Badge */}
                                                {product.discount && new Date(product.discount.end_date) > new Date() && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        -{product.discount.discount_value}%
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-gray-800 font-medium text-sm md:text-base mb-2 line-clamp-2 h-12 hover:text-blue-600 transition-colors">
                                                    {product.product_name}
                                                </h3>
                                                <div className="mt-2">
                                                    {product.discount && new Date(product.discount.end_date) > new Date() ? (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-lg font-bold text-red-600">
                                                                {new Intl.NumberFormat("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }).format(product.price * (1 - product.discount.discount_value / 100))}
                                                            </span>
                                                            <span className="text-xs text-gray-400 line-through">
                                                                {new Intl.NumberFormat("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                }).format(product.price)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-bold text-gray-800">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(product.price)}
                                                        </span>
                                                    )}
                                                </div>
                                                {product.discount && new Date(product.discount.end_date) > new Date() && (
                                                    <div className="flex items-center text-xs text-red-500 bg-red-50 rounded px-2 py-1">
                                                        <svg 
                                                            xmlns="http://www.w3.org/2000/svg" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            strokeWidth={2} 
                                                            stroke="currentColor" 
                                                            className="w-4 h-4 mr-1"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                d="M12 6v6l4 2m6-4A10 10 0 11.68 5.08 10 10 0 0122 12z" 
                                                            />
                                                        </svg>
                                                        {product.time_left}
                                                    </div>
                                                )}
                                                <div className="mt-4 flex justify-between items-center">
                                                    <span className="text-xs text-green-400">
                                                        {product.discount && product.discount.time_left ? 'Đang giảm giá' : 'Không có giảm giá'}
                                                    </span>
                                                    <button 
                                                        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center"
                                                        aria-label="Thêm vào giỏ hàng"
                                                    >
                                                        <ShoppingCartIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500 py-10">
                                Không có sản phẩm nào
                                </div>
                            )}
                        </div>
                        {hasMoreProducts && (
                            <div className="flex justify-center mt-6">
                                <button
                                onClick={handleLoadMore}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm 
                                                            text-gray-700 bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm 
                                                            hover:shadow-md active:scale-95"
                                >
                                <IoIosArrowDown className="text-gray-500 text-lg" />
                                Xem thêm sản phẩm {products ? (products.length - visibleProducts) : 0}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product_By_Brand;