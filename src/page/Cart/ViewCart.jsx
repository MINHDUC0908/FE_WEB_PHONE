import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaRegTrashCan } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi2";
import { HiMinus } from "react-icons/hi2";
import { toast } from "react-toastify";
import axios from "axios";
import { CartData } from "../../Context/CartContext";
import { api, src } from "../../Api";
import FooterProduct from "../Product/FooterProduct";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Trash2, X } from "lucide-react";

function ViewCart({setCurrentTitle}) {
    const { cart, deleteCart, setCart, loading, calculateTotalDiscount, calculateTotal, totalToPay } = CartData();
    const token = localStorage.getItem('token');
    const [modal, setModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate()

    const [loadedImages, setLoadedImages] = useState({});
    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };
    console.log("Tổng tiền:", calculateTotal);
    console.log("Tổng khuyến mãi:", calculateTotalDiscount);
    console.log("Cần thanh toán:", totalToPay);

    const [cartReady, setCartReady] = useState(false);
    useEffect(() => {
        if (!loading && cart) {
            setCartReady(true);
        } else {
            setCartReady(false);
        }
    }, [loading, cart]);
    useEffect(() => {
        setCurrentTitle('Giỏ hàng của bạn');
        window.scrollTo(0, 0);
    }, [setCurrentTitle]);
    const Delete = async (id) => {
        try {
            await deleteCart(id);
            toast.success("Xóa sản phẩm thành công!");
        } catch (error) {
            toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };
    useEffect(() => {
        if (cart && cart.length > 0) {
            console.log(cart);
        }
    }, [cart]);
    const updateOrder = async (id, token, selected) => {
        try {
            const res = await axios.put(
                api + `updateOrder/${id}`,
                { selected: selected ? 1 : 0 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (res && res.data) {
                toast.success(res.data.message);
                setCart((prevCart) =>
                    prevCart.map((item) =>
                        item.id === id ? { ...item, selected: selected ? 1 : 0 } : item
                    )
                );
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error.response?.data || error.message);
        }
    };
    // Kiểm tra nếu có ít nhất một sản phẩm được chọn
    const hasSelectedItems = cart?.some(item => item.selected === 1);
    const handleSelectAll = async (e) => {
        const isChecked = e.target.checked;
    
        try {
            const res = await axios.put(
                api + `updateAllOrders`,
                { selected: isChecked ? 1 : 0 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (res && res.data) {
                console.log('Cập nhật tất cả thành công:', res.data.message);
                setCart(res.data.data);
                toast.success('Cập nhật tất cả sản phẩm thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi chọn tất cả:', error.response?.data || error.message);
            toast.error('Không thể chọn tất cả sản phẩm. Vui lòng thử lại.');
        }
    };
    const handleQuantityChange = async (delta, item) => {
        if (!item) {
            toast.error("Không tìm thấy sản phẩm trong giỏ hàng");
            return;
        }
    
        const newQuantity = item.quantity + delta;
    
        if (newQuantity < 1 || newQuantity > 20) {
            toast.warning("Số lượng sản phẩm phải nằm trong khoảng từ 1 đến 5");
            return;
        }
        try {
            const response = await axios.put(
                api + `updateQuantity/${item.id}`, 
                { quantity: newQuantity },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
    
            if (response.data && response.data.data) {
                // Cập nhật trạng thái giỏ hàng với dữ liệu từ backend
                setCart((prevCart) =>
                    prevCart.map((cartItem) =>
                        cartItem.id === item.id
                            ? { ...cartItem, ...response.data.data }
                            : cartItem
                    )
                );
                toast.success(response.data.message || "Cập nhật số lượng thành công");
            } else {
                throw new Error("Phản hồi từ máy chủ không hợp lệ");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 
                'Không thể cập nhật số lượng'
            );
        }
    };
    

    const firstCartId = cart && cart.length > 0 ? cart[0].cart_id : null;
    const deleteAll = async (id) => {
        try {
            await axios.delete(api + `deleteAll/${id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            setCart([]);
            toast.success('Xóa tất cả sản phẩm thành công')
        } catch (error) {
            
        }
    }
    const ShowModal = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
                <div 
                    className="relative bg-gradient-to-b from-white to-gray-50 w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                    style={{ animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                >
                    <div className="h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500"></div>
                        <button 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-300 p-1 rounded-full hover:bg-gray-100"
                            onClick={() => setModal(false)}
                        >
                            <X size={18} />
                        </button>
                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <div className="bg-red-50 p-4 rounded-full shadow-sm border border-red-100">
                                    <Trash2 size={36} className="text-red-500" />
                                </div>
                            </div>
                            <h3 className="text-center text-xl font-semibold text-gray-800 mb-2">
                                Xoá sản phẩm
                            </h3>
                            <div className="flex items-center justify-center gap-2 mb-8 text-gray-600">
                                <p className="text-center">
                                Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?
                                </p>
                            </div>
            
                            <div className="flex justify-between gap-4">
                                <button
                                    className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                                    onClick={() => setModal(false)}
                                >
                                    Không
                                </button>
                            <button
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                                onClick={handleDelete}
                            >
                                <AlertCircle size={16} />
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const handleShowModal = (id) => {
        setDeleteId(id); // Lưu ID sản phẩm
        setModal(true);  // Hiển thị modal
    };
    const handleDelete = () => {
        if (modal)
        {
            Delete(deleteId)
            setModal(false);  // Đóng modal
            setDeleteId(null); // Xóa trạng thái lưu ID
        }
    }
    if (loading || !cartReady) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <FaShoppingBag className="text-blue-500 text-lg" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="bg-gray-50 py-4 border-b border-gray-200">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="text-sm font-medium text-gray-700">Giỏ hàng của bạn</div>
                </div>
            </div>

            {!loading && cart?.length === 0 && (
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 ">
                    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm  max-w-2xl mx-auto">
                    <div className="bg-blue-50 p-6 rounded-full mb-6">
                        <FaShoppingCart className="text-blue-500 text-5xl" />
                    </div>
                    <p className="text-gray-800 text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống!</p>
                    <p className="text-gray-500 mb-8 text-center">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy thêm sản phẩm để tiếp tục.</p>
                    <button
                        onClick={() => navigate("/product")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm"
                    >
                        <FaArrowLeft className="text-sm" />
                        Tiếp tục mua sắm
                    </button>
                    </div>
                </div>
            )}
            <div className="">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 mb-24">
                    { cart.length > 0 && (
                        <div>
                            <div className="grid grid-cols-1 xl:grid-cols-3">
                                <div className="col-span-1 xl:col-span-2">
                                    <div className="flex items-center justify-between gap-4 bg-gray-100 px-4 py-3 mt-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    name="selectAll"
                                                    id="selectAll"
                                                    onChange={handleSelectAll}
                                                    checked={cart.every((item) => item.selected === 1)}
                                                />
                                            </div>
                                            <span>Chọn tất cả ({cart.length})</span>
                                        </div>
                                        <FaRegTrashCan className="cursor-pointer text-xl" onClick={() =>deleteAll(firstCartId)}/>
                                    </div>
                                    <div className="mt-4">
                                        {
                                            cart.map(item => (
                                                <div key={item.id} className="bg-gray-100 p-4 mb-2 gap-y-4 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center gap-2 sm:gap-4">
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    className="bg-red-700"
                                                                    checked={item.selected === 1} // Liên kết với trạng thái `selected`
                                                                    onChange={(e) => updateOrder(item.id, token, e.target.checked)} // Gửi trạng thái khi thay đổi
                                                                />
                                                            </div>
                                                            <div className="h-16 w-16 relative">
                                                                <LazyLoadImage
                                                                    src={`${src}imgProduct/${item.product.images}`}
                                                                    alt={item.product.title}
                                                                    className={`w-full h-full object-contain transition-all duration-500 ${
                                                                        loadedImages[item.product.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                                    }`}
                                                                    onLoad={() => handleImageLoad(item.product.id)}
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center w-full">
                                                            <div className="flex flex-col gap-1 sm:gap-4 ml-4">
                                                                <div>
                                                                <span className="text-[12px] sm:text-sm line-clamp-2">
                                                                    {item.product.product_name}
                                                                </span>
                                                                </div>
                                                                <div>
                                                                    {item.colors?.color ? (
                                                                        <span className="inline-flex items-center  rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                            <span 
                                                                                className="w-3 h-3 rounded-full mr-1.5" 
                                                                                style={{ backgroundColor: item.colors.color }}
                                                                            ></span>
                                                                            {item.colors.color}
                                                                        </span>
                                                                    ) : <span>-</span>}
                                                                </div>
                                                                <div className="text-[10px] text-gray-700 block sm:hidden">
                                                                    {item.product.discount && new Date(item.product.discount.end_date) > new Date() ? (
                                                                        <>
                                                                            <span className="text-red-500 font-semibold">
                                                                                {new Intl.NumberFormat('vi-VN', {
                                                                                    style: 'currency',
                                                                                    currency: 'VND',
                                                                                }).format(
                                                                                    item.product.price * (1 - item.product.discount.discount_value / 100)
                                                                                )}
                                                                            </span>
                                                                            <span className="line-through text-gray-500 text-[10px] ml-2">
                                                                                {new Intl.NumberFormat('vi-VN', {
                                                                                    style: 'currency',
                                                                                    currency: 'VND',
                                                                                }).format(item.product.price)}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="font-semibold">
                                                                            {new Intl.NumberFormat('vi-VN', {
                                                                                style: 'currency',
                                                                                currency: 'VND',
                                                                            }).format(item.product.price)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="sm:flex items-center gap-4"> 
                                                                <div className="hidden md:flex flex-col items-start space-y-1">
                                                                    {item.product.discount && new Date(item.product.discount.end_date) > new Date() ? (
                                                                        <>
                                                                            <span className="text-red-500 font-semibold">
                                                                                {new Intl.NumberFormat('vi-VN', {
                                                                                    style: 'currency',
                                                                                    currency: 'VND',
                                                                                }).format(
                                                                                    item.product.price * (1 - item.product.discount.discount_value / 100)
                                                                                )}
                                                                            </span>
                                                                            <span className="line-through text-gray-500 text-sm">
                                                                                {new Intl.NumberFormat('vi-VN', {
                                                                                    style: 'currency',
                                                                                    currency: 'VND',
                                                                                }).format(item.product.price)}
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="font-semibold">
                                                                            {new Intl.NumberFormat('vi-VN', {
                                                                                style: 'currency',
                                                                                currency: 'VND',
                                                                            }).format(item.product.price)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex justify-end mb-6 sm:hidden">
                                                                    <button onClick={() => handleDelete(item.id)}>
                                                                        <FaRegTrashCan className="cursor-pointer text-sm"/>
                                                                    </button>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleQuantityChange(-1, item)}
                                                                        className="rounded-sm sm:px-1 sm:py-1 bg-gray-200 text-gray-700 sm:rounded-md hover:bg-gray-300 flex items-center justify-center"
                                                                        disabled={item.quantity <= 1 || loading}
                                                                    >
                                                                        <HiMinus />
                                                                    </button>
                                                                    <input
                                                                        // type="number"
                                                                        value={item.quantity}
                                                                        disabled={loading}
                                                                        onChange={(e) => {
                                                                            const newQuantity = Math.max(1, Number(e.target.value) || 1);
                                                                            handleQuantityChange(newQuantity - item.quantity, item);
                                                                        }}
                                                                        className="w-6 h-4 sm:w-12 sm:h-8 text-center bg-gray-100"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleQuantityChange(1, item)}
                                                                        className="rounded-sm sm:px-1 sm:py-1 bg-gray-200 text-gray-700 sm:rounded-md hover:bg-gray-300 flex items-center justify-center"
                                                                    >
                                                                        <HiPlus />
                                                                    </button>
                                                                </div>
                                                                <div className="hidden sm:block">
                                                                    <button onClick={() => handleShowModal(item.id)}>
                                                                        <FaRegTrashCan className="cursor-pointer text-lg"/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="col-span-1 xl:ml-5">
                                    <div className="sticky right-0 top-5 max-h-screen">
                                        <div className="items-center justify-between gap-4 bg-gray-100 px-4 py-3 mt-3 rounded-lg">
                                            <div className="mt-4">
                                                <div>
                                                    <p className="text-lg font-semibold mb-3">
                                                        Thông tin đơn hàng
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <p>
                                                            Tổng tiền
                                                        </p>
                                                        <p className="text-lg">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                                style: 'currency',
                                                                                currency: 'VND',
                                                            }).format(calculateTotal)}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-3">
                                                        <p>
                                                            Tổng khuyến mãi
                                                        </p>
                                                        <p className="text-lg">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(calculateTotalDiscount)}
                                                        </p>
                                                    </div>
                                                    <hr className="border-t-2 border-dashed border-gray-400 my-2"/>
                                                    <div className="flex justify-between items-center mt-3">
                                                        <p>
                                                            Cần thanh toán
                                                        </p>
                                                        <p className="text-lg text-red-500 font-medium">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                                style: 'currency',
                                                                                currency: 'VND',
                                                            }).format(totalToPay)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div 
                                                    className="text-center text-white text-lg bg-yellow-500 p-3 rounded-lg mt-5 hover:bg-yellow-600 cursor-pointer"
                                                    onClick={(e) => {
                                                        if (!hasSelectedItems) {
                                                            e.preventDefault();
                                                            toast.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
                                                        } else {
                                                            window.location.href = "/payment"; // Chuyển hướng nếu hợp lệ
                                                        }
                                                    }}
                                                >
                                                    Tiến hành thanh toán
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FooterProduct />
            {modal && <ShowModal/>}
        </>
    );
}

export default ViewCart;
