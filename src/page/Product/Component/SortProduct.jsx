import { useState } from "react";

function SortProduct({ setProducts, originalProducts }) {
    const [sortBy, setSortBy] = useState("");

    const handleSort = (sortOrder) => {
        if (!originalProducts) {
            console.error("Dữ liệu sản phẩm bị lỗi:", { originalProducts });
            return;
        }
        setSortBy(sortOrder);

        if (sortOrder === "default") {
            setProducts([...originalProducts]); 
            return;
        }
        const sortedProducts = [...originalProducts].sort((a, b) =>
            sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );
        setProducts(sortedProducts);
    };

    return (
        <div className="mb-6 bg-white rounded-lg shadow-lg border border-blue-200 p-4 flex flex-col md:flex-row md:items-center">
            <p className="text-lg font-semibold text-blue-800 mb-3 md:mb-0">
                Sắp xếp theo
            </p>
            <div className="flex items-center ml-auto">
                <select
                    className="px-4 py-2 border rounded-md text-blue-800 font-medium bg-white focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleSort(e.target.value)}
                >
                    <option value="default">Mặc định</option>
                    <option value="asc">Giá Thấp - Cao</option>
                    <option value="desc">Giá Cao - Thấp</option>
                </select>
            </div>
        </div>
    );
}

export default SortProduct;
