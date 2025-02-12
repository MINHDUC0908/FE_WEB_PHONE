import { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { BiArrowToBottom, BiArrowFromBottom } from "react-icons/bi";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { useData } from "../../Context/DataContext";
import { useDataProduct } from "../../Context/ProductContext";
import { src } from "../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Product({ setCurrentTitle }) {
    const { category, groupedBrands } = useData();
    const [open, setOpen] = useState(null);
    const { products, setProducts, loading, error, setId_product } = useDataProduct();
    const [sortby, setSortBy] = useState("");
    const [sortField, setSortField] = useState("price");
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [loaded, setLoaded] = useState(false)

    // Thiết lập tiêu đề trang
    useEffect(() => {
        setCurrentTitle("Cửa hàng - DUC COMPUTER");
    }, [setCurrentTitle]);

    // Mở/đóng danh mục
    const toggleCategory = (categoryName) => {
        setOpen((prev) => (prev === categoryName ? null : categoryName));
    };

    // Xử lý chọn sản phẩm
    const handleProduct = (id, product_name) => {
        localStorage.setItem("productShow", id);
        localStorage.setItem("productShowName", product_name);
        setId_product(id);
    };

    // Sắp xếp sản phẩm
    const handleSort = (sortOrder, field) => {
        setSortBy(sortOrder);
        setSortField(field);

        const sortedProducts = [...products].sort((a, b) => {
            return sortOrder === 'asc' 
                ? a[field] - b[field] 
                : b[field] - a[field];
        });

        setProducts(sortedProducts);
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

    // Hiển thị lỗi
    if (error) {
        return (
            <div className="text-red-500 text-center py-10">
                Lỗi tải dữ liệu
            </div>
        );
    }

    return (
        <>
            {/* Header danh mục */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <h1 className="text-lg text-blue-800 font-semibold">Sản phẩm</h1>
                </div>
            </div>

            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-6">
                    {/* Sidebar danh mục */}
                    <div className="col-span-1 bg-white rounded-xl shadow-md border border-gray-100 p-4 hidden lg:block">
                        <h2 className="text-lg font-semibold text-blue-800 mb-4">Danh mục</h2>
                        {category.map((cate) => (
                            <div key={cate.id} className="mb-2">
                                <div
                                    className="cursor-pointer flex justify-between items-center p-2 rounded-lg hover:bg-blue-50 transition"
                                    onClick={() => toggleCategory(cate.category_name)}
                                >
                                    <span className="text-gray-700 font-medium">
                                        {cate.category_name}
                                    </span>
                                    {groupedBrands[cate.id]?.length > 0 && (
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: open === cate.category_name ? 180 : 0 }} // Xoay icon khi mở
                                            transition={{ duration: 0.3 }}
                                        >
                                            <IoIosArrowDown className={open === cate.category_name ? "text-blue-500" : "text-gray-400"} />
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
                                                duration: Math.min(0.5 + (groupedBrands[cate.id]?.length || 0) * 0.1, 1.5), // Điều chỉnh thời gian dựa trên số lượng brand
                                            }}
                                            className="pl-4"
                                        >
                                            {groupedBrands[cate.id]?.map((brand) => (
                                                <div
                                                    key={brand.brand_id}
                                                    className="pl-4 py-1 text-sm text-gray-600 hover:text-gray-800 font-sans"
                                                >
                                                    {brand.brand_name}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Nội dung sản phẩm */}
                    <div className="col-span-4 lg:col-span-4">
                        {/* Các nút sắp xếp */}
                        <div className="mb-6 bg-white rounded-xl shadow-md border border-blue-100 p-4">
                            <p className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">
                                Sắp xếp theo
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => handleSort('asc', 'price')}
                                >
                                    <BiArrowFromBottom className="mr-2" size={20} /> 
                                    Giá Thấp-Cao
                                </button>
                                <button
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg hover:from-red-600 hover:to-pink-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => handleSort('desc', 'price')}
                                >
                                    <BiArrowToBottom className="mr-2" size={20} /> 
                                    Giá Cao-Thấp
                                </button>
                            </div>
                        </div>

                        {/* Lưới sản phẩm */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <motion.div 
                                        key={product.id} 
                                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {/* Nút yêu thích */}
                                        <button className="absolute top-3 right-3 z-10 bg-white/70 rounded-full p-2 hover:bg-white hover:shadow-md transition-all">
                                            <HeartIcon 
                                                className={`w-5 h-5 ${
                                                    hoveredProduct === product.id 
                                                        ? 'text-red-500 fill-current' 
                                                        : 'text-gray-400'
                                                }`} 
                                            />
                                        </button>

                                        <a
                                            href={`/product/${encodeURIComponent(product.product_name)}`}
                                            onClick={() => handleProduct(product.id, product.product_name)}
                                            className="block"
                                        >
                                            <div className="h-[250px] flex items-center justify-center p-4 bg-gray-50 relative">
                                                {/* Ảnh mờ (thumbnail) */}
                                                <LazyLoadImage
                                                    src={`${src}storage/${product.thumbnail}`}  // Ảnh thumbnail mờ
                                                    alt=""  // Đặt alt rỗng để không hiển thị bất kỳ văn bản nào
                                                    className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
                                                    loading="lazy"  // Lazy load cho ảnh mờ
                                                />
                                                {/* Ảnh chính */}
                                                <LazyLoadImage
                                                    src={loaded ? `${src}imgProduct/${product.images}` : `${src}storage/${product.thumbnail}`}  // Ảnh chính thay thế ảnh mờ khi tải xong
                                                    alt={product.product_name}  // Alt chỉ hiện khi ảnh chính tải xong
                                                    className={`w-full h-full object-contain transition-opacity duration-500 transform ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} 
                                                    onLoad={() => setLoaded(true)}  // Khi ảnh chính tải xong, set loaded = true
                                                    loading="lazy"  // Lazy load cho ảnh chính
                                                    aria-hidden={!loaded}  // Ẩn alt nếu ảnh chưa tải xong
                                                />
                                            </div>

                                            <div className="p-4">
                                                <h3 
                                                    className="text-blue-800 font-semibold mb-2 line-clamp-2 h-12"
                                                >
                                                    {product.product_name}
                                                </h3>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg font-bold text-red-600">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price)}
                                                    </p>
                                                    <button 
                                                        className={`p-2 rounded-full transition-all ${
                                                            hoveredProduct === product.id 
                                                                ? 'bg-blue-500 text-white shadow-md' 
                                                                : 'bg-gray-200 text-gray-500'
                                                        }`}
                                                    >
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;