import { useState } from "react";
import { ChevronDown, ChevronUp, Star, Info, Expand, Clock10Icon } from "lucide-react";
import { FiInfo, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

function ProductDes({ product }) {
    const rows = product.description.split("</tr>");
    const limitedRows = rows.slice(0, 5).join("</tr>");
    const fullContent = rows.join("</tr>");
    const [modal,  setModal] = useState(false)
    const [isExpandedOus, setIsExpandedOus] = useState(false);
    const LIMIT = 1800;
    const content = product.outstanding;
    const truncatedContent = content.length > LIMIT ? content.slice(0, LIMIT) + "..." : content;

    const ModalDes = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay với hiệu ứng fade */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black bg-opacity-50"
                ></motion.div>
                {/* Nội dung Modal với hiệu ứng phóng to */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative bg-white w-full lg:max-w-3xl 2xl:max-w-5xl rounded-lg shadow-lg p-6 text-center"
                >
                    <h2 className="font-bold text-xl mb-4 text-gray-800 flex items-center justify-between relative">
                        <div className="flex items-center">
                            <FiInfo className="w-6 h-6 text-blue-500 mr-2" />
                            Thông tin chi tiết
                        </div>
                        <button
                            className="absolute top-0 right-0 p-2 text-gray-600 hover:text-red-500 transition transform hover:scale-110"
                            onClick={() => setModal(false)}
                        >
                            <FiXCircle className="w-6 h-6" />
                        </button>
                    </h2>
                    <div className="overflow-y-auto max-h-[400px] lg:max-h-[450px] 2xl:max-h-[600px] text-gray-700 mb-4">
                        <div className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <div
                                className="text-gray-600 text-left"
                                dangerouslySetInnerHTML={{
                                    __html: fullContent,
                                }}
                            />
                        </div>
                    </div>
                    <style>
                        {`
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                border: 1px solid #ddd;
                                margin-top: 10px;
                                font-size: 14px;
                            }
                            table th, table td {
                                border: 1px solid #ddd;
                                text-align: left;
                                padding: 10px;
                            }
                            table th {
                                background-color: #f7f7f7;
                                color: #333;
                                font-size: 14px;
                                font-weight: 600;
                            }
                            table td {
                                background-color: #fff;
                                color: #555;
                            }
                            table tr:nth-child(even) {
                                background-color: #f9f9f9;
                            }
                        `}
                    </style>
                </motion.div>
            </div>
        );
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
            <div className="lg:col-span-2 flex flex-col bg-white p-6 rounded-lg shadow-md">
                <div className="relative bg-white rounded-lg shadow-md text-gray-700">
                    <h2 className="font-bold text-2xl mb-4 text-black flex items-center">
                        <Star className="w-6 h-6 text-yellow-500 mr-2" />
                        Đặc điểm nổi bật
                    </h2>
                    <div className="relative">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: isExpandedOus ? content : truncatedContent,
                            }}
                            className="text-gray-600 leading-relaxed"
                        />
                        {!isExpandedOus && (
                            <div className="absolute bottom-0 left-0 w-full h-[50px] bg-gradient-to-t from-white to-transparent flex justify-center items-end">
                                <button
                                    onClick={() => setIsExpandedOus(true)}
                                    className="mb-2 px-4 py-2 text-[#363636] bg-[#ffffff] rounded-md transition flex items-center justify-center border border-[#dbdbdb] shadow-lg"
                                >
                                    <Expand className="inline-block mr-2 w-5 h-5" />
                                    Đọc thêm
                                </button>
                            </div>
                        )}
                    </div>
                    {isExpandedOus && (
                        <button
                            onClick={() => setIsExpandedOus(false)}
                            className="mt-3 text-blue-500 hover:underline flex items-center"
                        >
                            <ChevronUp className="w-5 h-5 mr-1" />
                            Thu gọn
                        </button>
                    )}
                </div>
            </div>
            <div className="lg:col-span-1 flex flex-col bg-white py-6 px-3 rounded-lg shadow-md sticky top-5 h-fit">
                <h2 className="font-bold text-xl mb-4 text-black flex items-center">
                    <Info className="w-6 h-6 text-blue-500 mr-2" />
                    Thông tin chi tiết
                </h2>
                <div className="overflow-y-auto flex-grow text-gray-700">
                    <div className="w-full overflow-x-auto text-gray-600 bg-white p-4 rounded-lg shadow-md">
                        <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: limitedRows,
                            }}
                        />
                    </div>
                    {rows.length > 5 && (
                        <button
                            onClick={() => setModal(true)}
                            className="mt-3 w-full px-4 py-2 text-[#363636] bg-[#ffffff] rounded-md transition flex items-center justify-center border border-[#dbdbdb] shadow-lg"
                        >
                            <>
                                <ChevronDown className="w-5 h-5 mr-2" />
                                Xem chi tiết
                            </>
                        </button>
                    )}
                </div>
                <style>
                    {`
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            border: 1px solid #ddd;
                            margin-top: 10px;
                            font-size: 14px; /* Giảm kích thước chữ cho bảng */
                        }
                        table th, table td {
                            border: 1px solid #ddd;
                            text-align: left;
                        }
                        table th {
                            background-color: #f0f0f0;
                            color: #333;
                            width: "50px"
                            font-size: 13px; /* Giảm kích thước chữ cho tiêu đề bảng */
                            padding: 12px; /* Tăng padding cho th để khung bự hơn */
                        }
                        table td {
                            padding: 8px; /* Giữ nguyên padding cho td */
                        }
                        table tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                    `}
                </style>
            </div>
            {modal && <ModalDes />}
        </div>
    );
}

export default ProductDes;
