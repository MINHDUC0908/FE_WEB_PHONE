import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDataGetProduct } from "../../../Context/getProductCategory";
import SortProduct from "../Component/SortProduct";
import SiderBarProduct from "../Component/SidebarProduct";
import { ShoppingCartIcon } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { src } from "../../../Api";
import { IoIosArrowDown } from "react-icons/io";

function Product_By_Category({setCurrentTitle}) {
    const location = useLocation(); // Theo dõi sự thay đổi của route
    const [getCategoryName, setCategoryName] = useState("");
    const [getCategoryId, setCategoryId] = useState("");
    const { products, setId, setProducts, originalProducts, loading } = useDataGetProduct();
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [loaded, setLoaded] = useState(false);

    const updateCategoryFromLocalStorage = () => {
        const categoryLocal = sessionStorage.getItem("category");
        const idLocal = sessionStorage.getItem("id_category");
        if (categoryLocal && idLocal) {
            setCategoryId(idLocal);
            setCategoryName(categoryLocal);
            setId(idLocal);
        } else {
            setCategoryName("Chọn danh mục");
        }
    };

    // Đồng bộ trạng thái khi route hoặc localStorage thay đổi
    useEffect(() => {
        updateCategoryFromLocalStorage();
    }, [location.pathname]); // Theo dõi URL thay đổi

    useEffect(() => {
        setCurrentTitle(`Product-category: ${getCategoryName}`);
    }, [setCurrentTitle, getCategoryName]);
    useEffect(() => {
        console.log("Products updated:", products);
    }, [products]);
    
    const displayedProducts = products.slice(0, visibleProducts);
    const hasMoreProducts = visibleProducts < products.length;
    const handleLoadMore = () => {
        setVisibleProducts((prev) => prev + 4);
    };
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
                    {sessionStorage.getItem("category") && (
                        <>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-blue-600">
                            {sessionStorage.getItem("category")}
                        </span>
                        </>
                    )}
                    </h1>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
                {/* Sidebar danh mục */}
                    <SiderBarProduct setProducts={setProducts} originalProducts={originalProducts} />
                    {/* Nội dung sản phẩm */}
                    <div className="col-span-4 lg:col-span-6">
                        {/* Các nút sắp xếp */}
                        <SortProduct setProducts={setProducts} originalProducts={originalProducts}/>
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
                                                src={`${src}storage/${product.thumbnail}`}
                                                alt="" 
                                                className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
                                                loading="lazy"
                                            />
                                            <LazyLoadImage
                                                src={loaded ? `${src}imgProduct/${product.images}` : `${src}storage/${product.thumbnail}`}  // Ảnh chính thay thế ảnh mờ khi tải xong
                                                alt={product.product_name}  
                                                className={`w-full h-full object-contain transition-opacity duration-500 transform ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} 
                                                onLoad={() => setLoaded(true)}  
                                                loading="lazy"
                                                aria-hidden={!loaded} 
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-blue-800 font-semibold mb-2 line-clamp-2 h-12">
                                                {product.product_name}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold text-red-600">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                    }).format(product.price)}
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

export default Product_By_Category;
