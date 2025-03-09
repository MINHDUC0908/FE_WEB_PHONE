import { ShoppingCartIcon } from "lucide-react";
import { useSearch } from "../../../Context/SearchContext";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SortProduct from "../Component/SortProduct";
import { src } from "../../../Api";
import SideBarProductSearch from "./SideBarProductSearch";
import { IoIosArrowDown } from "react-icons/io";

function ProductSearch( { setCurrentTitle }) {
    const { products, setSearch, search, loading, setProducts, originalProducts } = useSearch();
    const [visibleProducts, setVisibleProducts] = useState(8);
    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("q");

        if (query) {
            setSearch(query);
        }
    }, [location.search, setSearch]);
    useEffect(() => {
        setCurrentTitle("Tìm kiếm sản phẩm")
    }, [setCurrentTitle])
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative w-full max-w-2xl rounded-lg shadow-2xl animate-bounce-in">
                    <p className="text-center text-white text-lg font-semibold animate-pulse">
                        Đang loading...
                    </p>
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }
    const displayedProducts = products.slice(0, visibleProducts);
    const hasMoreProducts = visibleProducts < products.length;
    const handleLoadMore = () => {
        setVisibleProducts((prev) => prev + 4);
    };
    return (
        <div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
                {/* Sidebar danh mục */}
                    <SideBarProductSearch/>
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
                                            handleProduct(product)
                                    }
                                    >
                                        <div className="h-[200px] lg:h-[300px] flex items-center justify-center p-4 bg-gray-50 relative">
                                            <LazyLoadImage
                                                src={`${src}imgProduct/${product.images}`}
                                                alt={product.product_name}
                                                className="w-full h-full object-contain transition-opacity duration-500"
                                                loading="lazy"
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
        </div>
    );
}

export default ProductSearch;
