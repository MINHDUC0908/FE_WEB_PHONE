import { useEffect, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { BiArrowToBottom } from "react-icons/bi";
import { BiArrowFromBottom } from "react-icons/bi";
import { useData } from "../../Context/DataContext";
import { useDataProduct } from "../../Context/ProductContext";

function Product({ setCurrentTitle }) {
    const { category, groupedBrands } = useData();
    const [open, setOpen] = useState(null);
    const { products, setProducts, loading, error, setId_product } = useDataProduct();
    const [sortby, setSortBy] = useState("");
    const [sortField, setSortField] = useState("price");

    useEffect(() => {
        setCurrentTitle("Cửa hàng - DUC COMPUTER");
    }, [setCurrentTitle]);

    const toggleCategory = (categoryName) => {
        setOpen((prev) => (prev === categoryName ? null : categoryName));
    };

    const handleProduct = (id, product_name) => {
        localStorage.setItem("productShow", id);
        localStorage.setItem("productShowName", product_name);
        setId_product(id);
    };
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative rounded-lg shadow-2xl animate-bounce-in">
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="text-red-500 text-center">
                Error loading data
            </div>
        );
    }
    // Sắp xếp
    const handleSortAsc = (sortby, sortField) => {
        setSortBy(sortby);
        setSortField(sortField);

        const cloneListProduct = [...products];

        cloneListProduct.sort((a, b) => {
            if (sortby === 'asc') {
                return a[sortField] - b[sortField]; // Sắp xếp số tăng dần
            } else {
                return b[sortField] - a[sortField]; // Sắp xếp số giảm dần
            }
        });
        setProducts(cloneListProduct);
    };
    const handleSortDesc = (sortby, sortField) => {
        setSortBy(sortby);
        setSortField(sortField);
    
        const cloneListProduct = [...products];
    
        cloneListProduct.sort((a, b) => {
            if (sortby === 'asc') {
                return a[sortField] - b[sortField]; // Sắp xếp tăng dần
            } else {
                return b[sortField] - a[sortField]; // Sắp xếp giảm dần
            }
        });
        setProducts(cloneListProduct);
    };
    
    return (
        
        <>
            <div className="bg-gray-100 py-3">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="text-sm text-gray-600">
                        Sản phẩm
                    </div>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 mb-[1500px]">
                <div className="grid grid-cols-4 lg:grid-cols-5 mt-5">
                    <div className="col-span-1 bg-gray-100 p-4 hidden lg:block">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h2>
                        <div className="">
                            {category.map((cate) => (
                                <div key={cate.id} className="mb-2">
                                    <div
                                        className="cursor-pointer flex justify-between items-center p-1 px-3 hover:bg-gray-100"
                                        onClick={() => toggleCategory(cate.category_name)}
                                    >
                                        <span className="text-gray-700 font-sans">
                                            {cate.category_name}
                                        </span>
                                        {groupedBrands[cate.id]?.length > 0 && (
                                            <motion.div
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: open === cate.category_name ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {open === cate.category_name ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
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
                    </div>
                    <div className="col-span-4 ml-0 lg:ml-8">
                        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                            <p className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                Sắp xếp theo
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => handleSortAsc('asc', 'price')}
                                >
                                    <BiArrowFromBottom className="mr-2 text-white" size={20} /> Giá Thấp-Cao
                                </button>
                                <button
                                    className="flex items-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg hover:from-red-600 hover:to-pink-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                    onClick={() => handleSortDesc('desc', 'price')}
                                >
                                    <BiArrowToBottom className="mr-2 text-white" size={20} /> Giá Cao-Thấp
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[700px] md:h-[850px] lg:h-[330px] xl:h-[400px] w-full">
                            {
                                products.length > 0 ? (
                                    products.map(product => (
                                        <motion.div key={product.id} className="border border-gray-300">
                                            <a
                                                href={`/product/${encodeURIComponent(product.product_name)}`}
                                                onClick={() => handleProduct(product.id, product.product_name)}
                                                className="block"
                                            >
                                                <div className="w-full">
                                                    <div className="aspect-w-1 aspect-h-1 overflow-hidden mt-10">
                                                        <img
                                                            src={`https://duc-phone.onrender.com/imgProduct/${product.images}`}
                                                            alt={product.product_name}
                                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                                        />
                                                    </div>
                                                    <h3
                                                        className="text-center mt-4 text-blue-500 lg:text-lg"
                                                        style={{
                                                            display: "-webkit-box",
                                                            WebkitBoxOrient: "vertical",
                                                            WebkitLineClamp: 3,
                                                            overflow: "hidden",
                                                            minHeight: "4.5rem",
                                                            lineHeight: "1.5rem",
                                                        }}
                                                    >
                                                        {product.product_name}
                                                    </h3>
                                                    <p className="text-lg font-bold text-center">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price)}
                                                    </p>
                                                    <div className="bg-gray-100 rounded-xl gap-2 my-1 mx-2 md:my-2 md:mx-3 xl:my-3 xl:mx-4">
                                                        <p className="p-2 text-sm">
                                                            Giao hàng miễn phí. Bảo hành chính hãng
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div>Không có sản phẩm nào</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;
