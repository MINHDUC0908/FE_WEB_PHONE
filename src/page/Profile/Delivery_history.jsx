import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";

function DeliveryHistory({ setCurrentTitle }) {
    const [orderStatus, setOrderStatus] = useState([]);
    const [status, setStatus] = useState(null);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [orderItem, setOrderItem] = useState([]);
    const [showOrderItem, setShowOrderItem] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(() => {
        
    });
    const [Delete, setDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const tabs = [
        { key: '', label: 'Tất cả'},
        { key: "Waiting for confirmation", label: "Đang chờ xử lý" },
        { key: "Processing", label: "Đã xác nhận" },
        { key: "Delivering", label: "Đang vận chuyển" },
        { key: "Completed", label: "Hoàn thành" },
        { key: 'Cancel', label: 'Đã hủy' },
    ];
    useEffect(() => {
        setCurrentTitle("Lịch sử mua hàng");
    }, [setCurrentTitle]);
    // Fetch dữ liệu đơn hàng theo trạng thái
    const fetchOrderStatus = useCallback(
        async (status, page) => {
            setLoading(true);
            try {
                const url = status
                    ? `https://duc-phone.onrender.com/api/orders/status/${status}?page=${page}`
                    : `https://duc-phone.onrender.com/api/order?page=${page}`;
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return res.data;
            } catch (error) {
                handleError(error, "Không thể lấy dữ liệu đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    const getOrderStatus = async (status, page) => {
        try {
            const results = await fetchOrderStatus(status, page);
            if (results && results.data) {
                setTotalPages(results.data.last_page);
                setCurrentPage(results.data.current_page); 
                setOrderStatus(results.data.data);
                localStorage.setItem('currentPage', results.data.current_page)
            }
        } catch (error) {
            console.error("Error fetching order status:", error);
        }
    };

    useEffect(() => {
        getOrderStatus(status, currentPage); // Gọi getOrderStatus khi status hoặc currentPage thay đổi
    }, [status, currentPage]); // Chỉ gọi lại khi status hoặc currentPage thay đổi
    console.log(orderStatus);
    // Hủy đơn hàng
    const cancelOrder = useCallback(
        async (id) => {
            try {
                const res = await axios.put(
                    `https://duc-phone.onrender.com/api/updateOrderStatus/${id}`,
                    { status: 'cancelled' }, 
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (res.status === 200) {
                    toast.success("Hủy đơn hàng thành công");
                    setOrderStatus((prev) => 
                        prev.map((order) =>
                            order.id === id ? { ...order, status: 'Cancel' } : order
                        )
                    );
                    fetchOrderStatus(status);
                } else {
                    throw new Error("Không thể hủy đơn hàng");
                }
            } catch (error) {
                handleError(error, "Không thể hủy đơn hàng. Vui lòng thử lại.");
            }
        },
        [token, fetchOrderStatus, status]
    );
    

    // xem chi tiết đơn hàng
    const fetchOrderItem = async (id) => {
        try {
            const res = await axios.get(`https://duc-phone.onrender.com/api/showOrder/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (res && res.data)
            {
                setOrderItem(res.data.data);
                setShowOrderItem(true);
            }
        } catch (error) {
            
        }
    }
    const handleError = (error, fallbackMessage) => {
        toast.error(fallbackMessage || "Đã có lỗi xảy ra");
        console.error(error);
    };
    const OrderItemForm = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowOrderItem(false)}></div>
                <div className="relative bg-white w-full max-w-2xl rounded-sm">
                    <div className="p-4 flex items-center justify-between">
                        <div className="font-semibold">
                            Chi tiết sản phẩm
                        </div>
                        <div>
                            <MdClose size={20} className="hover:text-red-950 cursor-pointer " onClick={() => setShowOrderItem(false)}/>
                        </div>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="min-w-full text-xs text-gray-600 bg-gray-50 shadow-sm rounded-lg table-auto">
                            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-left">
                                <tr>
                                    <th className="px-4 py-2 font-semibold text-center">Mã đơn hàng</th>
                                    <th className="px-4 py-2 font-semibold text-center">Tên sản phẩm</th>
                                    <th className="px-4 py-2 font-semibold text-center">Hình ảnh sản phẩm</th>
                                    <th className="px-4 py-2 font-semibold text-center">Màu sắc</th>
                                    <th className="px-4 py-2 font-semibold text-center">Số lượng</th>
                                    <th className="px-4 py-2 font-semibold text-center">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItem.length > 0 ? (
                                    orderItem.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="bg-white border-b hover:bg-gray-100 transition duration-200"
                                        >
                                            <td className="px-4 py-2 text-center">{order.order.order_number}</td>
                                            <td className="px-4 py-2 text-center">{order.product.product_name}</td>
                                            <td className="px-4 py-2 text-center">
                                                <img
                                                    src={`http://127.0.0.1:8000/imgProduct/${order.product.images}`}
                                                    alt={order.product.product_name}
                                                    className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-300"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {order.color?.color ? order.color.color : 'none'}
                                            </td>
                                            <td className="px-4 py-2 text-center">{order.quantity}</td>
                                            <td className="px-4 py-2 text-center">{parseInt(order.product.price).toLocaleString()}₫</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-8 text-center text-gray-500 italic"
                                        >
                                            Không có đơn hàng nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
    const handleClick = (id) => {
        localStorage.setItem("current_tab", id);
        setStatus(id); 
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
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="relative bg-white w-full max-w-sm rounded-sm" style={{ animation: 'fadeIn 0.5s forwards' }}>
                    <div className="rounded-lg w-96 p-6">
                        <h3 className="text-center text-lg font-semibold mb-4">
                        Bạn muốn xoá sản phẩm này
                                ra khỏi giỏ hàng?
                        </h3>
                        <div className="flex justify-between">
                        <button
                            className="bg-gray-300 text-black w-[160px] py-2 rounded-lg font-medium hover:bg-gray-400"
                            onClick={() => setDelete(false)}
                        >
                            Không
                        </button>
                        <button
                            className="bg-red-600 text-white w-[160px] py-2 rounded-lg font-medium hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Xác nhận
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="mx-auto lg:p-4">
            <div className="flex gap-2 lg:gap-4 mb-4 overflow-y-auto whitespace-nowrap min-w-0">
                {status !== null && 
                    tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`text-[13px] lg:text-[16px] py-2 px-4 rounded-sm ${
                                status === tab.key ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => handleClick(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))
                }
            </div>
            {
                loading ? (
                    <div className="flex justify-center items-center min-h-screen space-x-4">
                        <div className="animate-spin-2x rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid" />
                    </div>

                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-xs lg:text-sm text-gray-600 bg-gray-50 shadow-sm rounded-lg">
                        <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-left text-[10px]">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-center">Mã đơn hàng</th>
                                <th className="px-6 py-4 font-semibold text-center">Tổng giá trị</th>
                                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-center">Ngày tạo</th>
                                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderStatus.length > 0 ? (
                                orderStatus.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="bg-white border-b hover:bg-gray-100 transition duration-200"
                                    >
                                        <td className="px-6 py-4 text-center font-medium text-gray-800">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4 text-center text-green-600 font-semibold">
                                            {parseInt(order.total_price).toLocaleString()}₫
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-center font-semibold ${
                                                order.status === "Waiting for confirmation"
                                                    ? "text-yellow-500"
                                                    : order.status === "Processing"
                                                    ? "text-blue-500"
                                                    : order.status === "Delivering"
                                                    ? "text-indigo-500"
                                                    : order.status === "Completed"
                                                    ? "text-green-500"
                                                    : order.status === "Cancel" 
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {tabs.find((tab) => tab.key === order.status)?.label || "Không rõ"}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {new Date(order.created_at).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4 text-center flex items-center justify-center space-x-4">
                                            {order.status === "Waiting for confirmation" && (
                                                <button
                                                    onClick={() => handleShowModal(order.id)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
                                                >
                                                    <MdDelete className="text-white" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => fetchOrderItem(order.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
                                            >
                                                <FaEye className="text-white" onClick={() => setShowOrderItem(true)}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-500 italic"
                                    >
                                        Không có đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 mb-4 flex justify-center items-center space-x-6">
                        <button
                            className="px-2 py-1 text-black duration-300 text-lg font-semibold focus:outline-none cursor-pointer"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FaArrowLeft/>
                        </button>

                        <span className="text-sm font-medium text-gray-700">
                            Trang {currentPage} / {totalPages}
                        </span>

                        <button
                            className="px-2 py-1 text-black duration-300 text-lg font-semibold focus:outline-none cursor-pointer"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FaArrowRight/>
                        </button>
                    </div>
                </div>
                )
            }
            {showOrderItem && <OrderItemForm/>}
            {Delete && <ModalDelete/>}
        </div>
    );
}

export default DeliveryHistory;
