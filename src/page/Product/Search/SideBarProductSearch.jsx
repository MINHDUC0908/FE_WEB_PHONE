import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../../Context/DataContext";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { formatPrice } from "../../../Api";
import { FiFilter } from "react-icons/fi";

function SideBarProductSearch() {
    const { category, groupedBrands } = useData();
    const [open, setOpen] = useState(null);
    const toggleCategory = (categoryName) => {
        setOpen((prev) => (prev === categoryName ? null : categoryName));
    };
    return (
        <div className="col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-5 hidden lg:block sticky top-4 h-fit">
            <h2 className="text-lg font-bold text-blue-700 mb-5 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">📂</span>
                Danh mục sản phẩm
            </h2>
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
    );
}
export default SideBarProductSearch;