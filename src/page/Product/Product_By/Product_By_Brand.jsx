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

function Product_By_Brand({setCurrentTitle}) {
    const location = useLocation();
    const [getBrandName, setBrandName] = useState("");
    const { products, setId_brand, setProducts, originalProducts, loading } = useDataBanrd();
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [imageLoaded, setImageLoaded] = useState({});
    const { category, brand } = useData();
    
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
    
    const handleImageLoad = (productId) => {
        setImageLoaded(prev => ({
            ...prev,
            [productId]: true
        }));
    };
    
    // Hiển thị loading
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
                <div className="relative rounded-lg shadow-2xl">
                <div className="flex justify-center mt-4">
                    <div className="w-12 h-12 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
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
                                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
                                >
                                    <a
                                        href={`/product/${encodeURIComponent(
                                            product.product_name
                                        )}`}
                                        onClick={() =>
                                            handleProduct(product.id, product.product_name)
                                        }
                                    >
                                        <div className="h-[200px] lg:h-[300px] flex items-center justify-center p-4 bg-gray-50 relative">
                                            <LazyLoadImage
                                                src={product.thumbnail ? `${src}storage/${product.thumbnail}` : ''}
                                                alt="" 
                                                className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ${imageLoaded[product.id] ? 'opacity-0' : 'opacity-100'}`}
                                                loading="lazy"
                                            />
                                            <LazyLoadImage
                                                src={product.images ? `${src}imgProduct/${product.images}` : `${src}storage/${product.thumbnail}`}
                                                alt={product.product_name || ''}  
                                                className={`w-full h-full object-contain transition-opacity duration-500 transform ${imageLoaded[product.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} 
                                                onLoad={() => handleImageLoad(product.id)}  
                                                loading="lazy"
                                                aria-hidden={!imageLoaded[product.id]} 
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-blue-800 font-semibold mb-2 line-clamp-2 h-12">
                                                {product.product_name || 'Sản phẩm không có tên'}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold text-red-600">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                    }).format(product.price || 0)}
                                                </p>
                                                <button className="p-2 rounded-full bg-gray-200 text-gray-500">
                                                    <ShoppingCartIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </a>
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