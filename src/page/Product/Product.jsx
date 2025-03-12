import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { motion } from "framer-motion";
import { ShoppingCartIcon } from "lucide-react";
import { useDataProduct } from "../../Context/ProductContext";
import { src } from "../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SiderBarProduct from "./Component/SidebarProduct";
import SortProduct from "./Component/SortProduct";
import { FaShoppingBag } from "react-icons/fa";

function Product({ setCurrentTitle }) {
    const {
        products,
        setProducts,
        loading,
        error,
        setId_product,
        originalProducts,
    } = useDataProduct();
    const [visibleProducts, setVisibleProducts] = useState(12);
    const [loaded, setLoaded] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentTitle("Cửa hàng - DUC COMPUTER");
    }, [setCurrentTitle]);

    // Xử lý chọn sản phẩm
    const handleProduct = (product) => {
        setId_product(product.id);
        let viewedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];
    
        // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách, thì xóa nó đi trước khi thêm mới
        viewedProducts = viewedProducts.filter(p => p.id !== product.id);
    
        // Thêm sản phẩm mới lên đầu danh sách
        viewedProducts.unshift(product);
    
        // Giới hạn số lượng sản phẩm lưu (ví dụ: chỉ lưu 5 sản phẩm gần nhất)
        if (viewedProducts.length > 5) {
            viewedProducts.pop();
        }
    
        localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
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
    if (error) {
        return (
            <div className="text-red-500 text-center py-10">Lỗi tải dữ liệu</div>
        );
    }

    const displayedProducts = products.slice(0, visibleProducts);
    const hasMoreProducts = visibleProducts < products.length;
    const handleLoadMore = () => {
        setVisibleProducts((prev) => prev + 8);
    };
    console.log(products);
    return (
        <>
        {/* Header danh mục */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <h1 className="text-black font-semibold">Sản phẩm</h1>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
                {/* Sidebar danh mục */}
                    <SiderBarProduct setProducts={setProducts} originalProducts={originalProducts} products={products} />

                    {/* Nội dung sản phẩm */}
                    <div className="col-span-4 lg:col-span-6">
                        {/* Các nút sắp xếp */}
                        <SortProduct setProducts={setProducts} originalProducts={originalProducts}/>

                        {/* Lưới sản phẩm */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
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
                                        <a
                                            href={`/product/${encodeURIComponent(product.product_name)}`}
                                            onClick={() => handleProduct(product)}
                                            className="block h-full"
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
                                        </a>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-lg font-medium">Không có sản phẩm nào</p>
                                <p className="text-sm mt-2">Vui lòng thử lại với bộ lọc khác</p>
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
                                Xem thêm sản phẩm {products.length - visibleProducts}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;
