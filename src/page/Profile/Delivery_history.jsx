import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { FaEye, FaShoppingBag } from "react-icons/fa";
import { MdAttachMoney, MdColorLens, MdImage, MdInfoOutline, MdInventory, MdLocalShipping, MdNumbers, MdReceipt, MdZoomIn } from "react-icons/md";
import { BsCheckCircleFill, BsXCircleFill, BsClockHistory } from "react-icons/bs";
import { api, src } from "../../Api";
import { MdDelete, MdWarning, MdClose, MdShoppingCart } from 'react-icons/md';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function DeliveryHistory({ setCurrentTitle }) {
    const [orderStatus, setOrderStatus] = useState([]);
    const [status, setStatus] = useState(null);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [ orderItem, setOrderItem] = useState([]);
    const [Delete, setDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showOrder, setShowOrderItem] = useState(false)
    const [isloading, setIsLoading] = useState(true);
    const tabs = [
        { key: "", label: "Tất cả", icon: <FaShoppingBag /> },
        { key: "Waiting for confirmation", label: "Đang chờ xử lý", icon: <BsClockHistory /> },
        { key: "Processing", label: "Đã xác nhận", icon: <BsCheckCircleFill /> },
        { key: "Delivering", label: "Đang vận chuyển", icon: <MdLocalShipping /> },
        { key: "Completed", label: "Hoàn thành", icon: <BsCheckCircleFill /> },
        { key: "Cancel", label: "Đã hủy", icon: <BsXCircleFill /> },
    ];
    const [visibleOrder, setVisibleOrder] = useState(10);
    const displayOrser = orderStatus.slice(0, visibleOrder)
    const hasMoreOrder = visibleOrder < orderStatus.length;
    const hanldeLoadMore = () => {
        setVisibleOrder((prev) => prev + 5);
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentTitle("Lịch sử mua hàng");
    }, [setCurrentTitle]);

    // Lấy danh sách đơn hàng theo trạng thái
    const fetchOrderStatus = useCallback(
        async (status) => {
            setLoading(true);
            try {
                const url = status ? `${api}orders/status/${status}` : `${api}order`;
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data && res.data.data) {
                    setOrderStatus(res.data.data);
                }
            } catch (error) {
                console.error("Không thể lấy dữ liệu đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    useEffect(() => {
        fetchOrderStatus(status);
    }, [status, fetchOrderStatus]);

    const handleClick = (id) => {
        localStorage.setItem("current_tab", id);
        setStatus(id);
    };

    useEffect(() => {
        const savedTab = localStorage.getItem("current_tab");
        setStatus(savedTab || tabs[0].key);
    }, []);

    const getStatusBadgeClass = (orderStatus) => {
        switch(orderStatus) {
            case "Waiting for confirmation":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Processing":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Delivering":
                return "bg-indigo-100 text-indigo-800 border-indigo-300";
            case "Completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "Cancel":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };
    // Hủy đơn hàng
    const cancelOrder = async (id) => {
        try {
            const res = await axios.put(
                api + `updateOrderStatus/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("API Response:", res.data);
            if (res.data.status == "success") {
                toast.success("Hủy đơn hàng thành công");
                setOrderStatus((prev) => 
                    prev.map((order) =>
                        order.id === id ? { ...order, status: 'Cancel' } : order
                    )
                );
            } else {
                throw new Error("Không thể hủy đơn hàng");
            }
        } catch (error) {

        }
    };

    const fetchOrderItem = async (id) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${api}showOrder/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (res?.data) {
                setOrderItem(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi xem chi tiết:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const OrderItemForm = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowOrderItem(false)}></div>
                <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-lg">
                    <div className="p-4 flex items-center justify-between border-b">
                        <div className="font-semibold flex items-center">
                            <MdShoppingCart size={22} className="text-blue-600 mr-2" />
                            Chi tiết sản phẩm
                        </div>
                        <div>
                            <MdClose size={20} className="hover:text-red-600 cursor-pointer transition-colors duration-200" onClick={() => setShowOrderItem(false)} />
                        </div>
                    </div>
                    {isloading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                    <FaShoppingBag className="text-blue-500 text-lg" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[600px] overflow-y-auto p-2">
                            <table className="min-w-full text-xs text-gray-600 bg-gray-50 shadow-sm rounded-lg table-auto">
                                <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-left">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold text-center">
                                            <div className="flex items-center justify-center">
                                                <MdReceipt size={18} className="mr-1" />
                                                Mã đơn hàng
                                            </div>
                                        </th>
                                        <th className="px-4 py-2 font-semibold text-center">
                                            <div className="flex items-center justify-center">
                                                <MdInventory size={18} className="mr-1" />
                                                Tên sản phẩm
                                            </div>
                                        </th>
                                        <th className="px-4 py-2 font-semibold text-center">
                                            <div className="flex items-center justify-center">
                                                <MdImage size={18} className="mr-1" />
                                                Hình ảnh sản phẩm
                                            </div>
                                        </th>
                                        <th className="px-4 py-2 font-semibold text-center">
                                            <div className="flex items-center justify-center">
                                                <MdColorLens size={18} className="mr-1" />
                                                Màu sắc
                                            </div>
                                        </th>
                                        <th className="px-4 py-2 font-semibold text-center">
                                            <div className="flex items-center justify-center">
                                                <MdNumbers size={18} className="mr-1" />
                                                Số lượng
                                            </div>
                                        </th>
                                        <th className="px-4 py-2 font-semibold text-center">
                                            <div className="flex items-center justify-center">
                                                <MdAttachMoney size={18} className="mr-1" />
                                                Giá
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItem.length > 0 ? (
                                        orderItem.map((order) => (
                                            <tr key={order.id} className="bg-white border-b hover:bg-gray-100 transition duration-200">
                                                <td className="px-4 py-2 text-center">{order.order.order_number}</td>
                                                <td className="px-4 py-2 text-center">{order.product.product_name}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="relative group">
                                                        <img
                                                            src={`${src}imgProduct/${order.product.images}`}
                                                            alt={order.product.product_name}
                                                            className="h-16 w-16 object-cover rounded-md transform group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <MdZoomIn size={24} className="text-white bg-black bg-opacity-50 rounded-full p-1" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: order.color?.color || 'transparent', border: '1px solid #ccc' }}></div>
                                                        {order.color?.color ? order.color.color : 'Không có'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <MdInventory size={14} className="text-gray-500 mr-1" />
                                                        {order.quantity}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center font-medium text-blue-600">
                                                    {parseInt(order.price || order.product.price).toLocaleString()}₫
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-gray-500 italic">
                                                <div className="flex flex-col items-center justify-center">
                                                    <MdInfoOutline size={24} className="text-gray-400 mb-2" />
                                                    Không có đơn hàng nào.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    <div className="p-4 border-t flex justify-end">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md flex items-center hover:shadow-md transition duration-200" onClick={() => setShowOrderItem(false)}>
                            <MdClose size={18} className="mr-1" />
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    

    useEffect(() => {
        const savedTab = localStorage.getItem("current_tab");
        if (savedTab) {
            setStatus(savedTab);
        } else {
            setStatus(tabs[0].key);
        }
    }, []);
    const handleShowModal = (id) => {
        setDeleteId(id);
        setDelete(true)
    }
    const handleDelete = () => {
        if (Delete)
        {
            cancelOrder(deleteId);
            setDelete(false);
            setDeleteId(null);
        }
    }
    const ModalDelete = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" onClick={() => setDelete(false)}></div>
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white w-full max-w-md rounded-xl shadow-2xl mx-4"
                >
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                        <div className="bg-red-100 p-4 rounded-full border-4 border-white shadow-lg">
                            <MdWarning className="text-red-500 text-4xl" />
                        </div>
                    </div>
                    <button 
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setDelete(false)}
                    >
                        <MdClose className="text-xl" />
                    </button>
                    
                    <div className="pt-10 pb-6 px-6">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Xóa sản phẩm
                            </h3>
                            <p className="text-gray-500">
                                Bạn có chắc chắn muốn xóa sản phẩm này ra khỏi giỏ hàng?
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center border border-gray-100">
                            <div className="bg-red-50 p-2 rounded-lg mr-3">
                                <MdShoppingCart className="text-red-500 text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Sản phẩm sẽ bị xóa vĩnh viễn khỏi giỏ hàng của bạn và bạn sẽ cần thêm lại nếu muốn mua.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between gap-4">
                            <button
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                onClick={() => setDelete(false)}
                            >
                                <MdClose className="text-lg" />
                                <span>Hủy bỏ</span>
                            </button>
                            <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                onClick={handleDelete}
                            >
                                <MdDelete className="text-lg" />
                                <span>Xác nhận xóa</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }
    return (
        <div className="max-w-5xl mx-auto p-4 lg:p-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-gray-800">Lịch sử mua hàng</h2>
                    <p className="text-gray-500 mt-1">Quản lý và theo dõi đơn hàng của bạn</p>
                </div>
                <div className="flex items-center">
                    <span className="mr-2 text-gray-600">Trạng thái:</span>
                    <select 
                        className="form-select bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => handleClick(e.target.value)}
                        value={status || ""}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.key} value={tab.key}>
                                {tab.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-x-auto flex md:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 whitespace-nowrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                status === tab.key 
                                ? "bg-blue-500 text-white shadow-md" 
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }`}
                            onClick={() => handleClick(tab.key)}
                        >
                            <span className="mr-1.5">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="hidden md:flex md:flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            status === tab.key 
                            ? "bg-blue-500 text-white shadow-md" 
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleClick(tab.key)}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                            <FaShoppingBag className="text-blue-500 text-lg" />
                        </div>
                    </div>
                    <p className="ml-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm text-gray-600 bg-white">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                <th className="px-6 py-4 font-semibold text-left">Mã đơn hàng</th>
                                <th className="px-6 py-4 font-semibold text-right">Tổng giá trị</th>
                                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-center">Ngày tạo</th>
                                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayOrser.length > 0 ? (
                                displayOrser.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            #{order.order_number}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-green-600">
                                            {parseInt(order.total_price).toLocaleString()}₫
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(order.status)}`}>
                                                    {tabs.find((tab) => tab.key === order.status)?.label || "Không rõ"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                {order.status === "Waiting for confirmation" && (
                                                    <button onClick={() => handleShowModal(order.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Hủy đơn hàng">
                                                        <MdDelete className="text-xl" />
                                                    </button>
                                                )}
                                                <button onClick={() => {fetchOrderItem(order.id, setShowOrderItem(true))}} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Xem chi tiết">
                                                    <FaEye className="text-xl"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <FaShoppingBag className="text-4xl mb-3 text-gray-300" />
                                            <p className="font-medium mb-1">Không có đơn hàng nào</p>
                                            <p className="text-sm text-gray-400">Bạn chưa có đơn hàng nào trong mục này</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            <div className="flex justify-center mt-8">
                                {hasMoreOrder ? (
                                    <button
                                    onClick={hanldeLoadMore}
                                    className="group flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full
                                            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all 
                                            duration-200 shadow-sm hover:shadow hover:border-gray-300 active:scale-98"
                                    >
                                    <span className="flex items-center justify-center w-6 h-6 bg-blue-50 rounded-full 
                                                    group-hover:bg-blue-100 transition-colors duration-200">
                                        <IoIosArrowDown className="text-blue-600 text-base" />
                                    </span>
                                    <span>Xem thêm sản phẩm {orderStatus.length - visibleOrder}</span>
                                    </button>
                                ) : (
                                    <button
                                    onClick={() => {setVisibleOrder(10), window.scrollTo(0,0)}}
                                    className="group flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full
                                            text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all 
                                            duration-200 shadow-sm hover:shadow hover:border-gray-300 active:scale-98"
                                    >
                                    <span className="flex items-center justify-center w-6 h-6 bg-blue-50 rounded-full 
                                                    group-hover:bg-blue-100 transition-colors duration-200">
                                        <IoIosArrowUp className="text-blue-600 text-base" />
                                    </span>
                                    <span>Ẩn bớt sản phẩm</span>
                                    </button>
                                )}
                            </div>
                        </tbody>
                    </table>
                </div>
            )}
            {Delete && <ModalDelete/>}
            { showOrder && <OrderItemForm/>}
        </div>
    );
}

export default DeliveryHistory;