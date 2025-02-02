import React, { useEffect, useMemo, useState } from "react";

import { FaRegTrashCan } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi2";
import { HiMinus } from "react-icons/hi2";
import { IoGiftOutline } from "react-icons/io5";
import { FiTag } from "react-icons/fi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartData } from "../../Context/CartContext";

function ViewCart({setCurrentTitle}) {
    const { cart, deleteCart, setCart } = CartData();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [modal, setModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const calculateTotal = useMemo(() => {
        return cart
            .filter(item => item.selected === 1)
            .reduce((total, item) => {
                return total + item.quantity * item.price;
            }, 0);
    }, [cart]);
    
    useEffect(() => {
        setCurrentTitle('Giỏ hàng của bạn');
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
                `http://127.0.0.1:8000/api/updateOrder/${id}`,
                { selected: selected ? 1 : 0 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (res && res.data) {
                console.log('Cập nhật thành công:', res.data.message);
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
    const hasSelectedItems = cart.some(item => item.selected === 1);
    const handleSelectAll = async (e) => {
        const isChecked = e.target.checked;
    
        try {
            const res = await axios.put(
                `http://127.0.0.1:8000/api/updateAllOrders`,
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
                `http://127.0.0.1:8000/api/updateQuantity/${item.id}`, 
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
    

    const firstCartId = cart[0]?.cart_id;
    const deleteAll = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/deleteAll/${id}`, 
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
                            onClick={() => setModal(false)}
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
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

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
    return (
        <>
            <div className="bg-gray-100 py-3">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="text-sm text-gray-600">Giỏ hàng của bạn</div>
                </div>
            </div>
            <div className="">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 mb-24">
                    { cart.length > 0 ? (
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
                                                            <div>
                                                                <img
                                                                    src={`http://127.0.0.1:8000/imgProduct/${item.product.images}`}
                                                                    alt={item.product.product_name}
                                                                    className="sm:h-[100px] h-[50px] w-full object-cover border border-gray-300 rounded-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center w-full">
                                                            <div className="flex flex-col gap-1 sm:gap-4 ml-4">
                                                                <div>
                                                                <span className="text-[12px] sm:text-lg line-clamp-2">
                                                                    {item.product.product_name}
                                                                </span>
                                                                </div>
                                                                <div>
                                                                    {item.colors?.color && (
                                                                        <span className="bg-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-lg rounded-lg" style={{ color: item.colors.color }}>
                                                                            {item.colors.color}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-700 block sm:hidden">
                                                                    {new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    }).format(item.price)}
                                                                </div>
                                                            </div>
                                                            <div className="sm:flex items-center gap-4"> 
                                                                <div className="text-lg text-gray-700 hidden sm:block">
                                                                    {new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    }).format(item.price)}
                                                                </div>
                                                                <div className="flex justify-end mb-6 sm:hidden">
                                                                    <button onClick={() => handleDelete(item.id)}>
                                                                        <FaRegTrashCan className="cursor-pointer text-xl"/>
                                                                    </button>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleQuantityChange(-1, item)}
                                                                        className="rounded-sm sm:px-2 sm:py-2 bg-gray-200 text-gray-700 sm:rounded-md hover:bg-gray-300 flex items-center justify-center"
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
                                                                        className="rounded-sm sm:px-2 sm:py-2 bg-gray-200 text-gray-700 sm:rounded-md hover:bg-gray-300 flex items-center justify-center"
                                                                    >
                                                                        <HiPlus />
                                                                    </button>
                                                                </div>
                                                                <div className="hidden sm:block">
                                                                    <button onClick={() => handleShowModal(item.id)}>
                                                                        <FaRegTrashCan className="cursor-pointer text-xl"/>
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
                                    <div className="sticky right-0 top-0 max-h-screen">
                                        <div className="flex items-center justify-between gap-4 bg-gray-100 px-4 py-3 mt-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <IoGiftOutline className="text-xl"/>
                                                </div>
                                                <span>Quà tặng</span>
                                            </div>
                                        </div>
                                        <div className="items-center justify-between gap-4 bg-gray-100 px-4 py-3 mt-3 rounded-lg">
                                            <div className="flex justify-between items-center bg-white ">
                                                <div className="flex items-center gap-2 py-3 rounded-lg pl-5">
                                                    <div>
                                                        <FiTag className="text-xl"/>
                                                    </div>
                                                    <span>Ưu đãi của sản phẩm</span>
                                                </div>
                                                <div className="pr-5">
                                                    None
                                                </div>
                                            </div>
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
                                                            }).format(0)}
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
                                                            }).format(calculateTotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-center text-white text-lg bg-yellow-500 p-3 rounded-lg mt-5 hover:bg-yellow-600">
                                                    <Link 
                                                        to="/payment" 
                                                        onClick={(e) => {
                                                            if (!hasSelectedItems) {
                                                                e.preventDefault();
                                                                toast.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
                                                            }
                                                        }}>
                                                        Tiến hành thanh toán
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-lg text-gray-600">
                                Giỏ hàng của bạn hiện tại trống.
                            </p>
                            <Link to={'/product'}>
                                <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                                    Tiếp tục mua sắm
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {modal && <ShowModal/>}
        </>
    );
}

export default ViewCart;
