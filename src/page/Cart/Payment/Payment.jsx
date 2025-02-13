import { useState, useEffect, useMemo } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CartData } from "../../../Context/CartContext";
import { api, src } from "../../../Api";

function Payment({setCurrentTitle}) {
    const token = localStorage.getItem('token');
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [shippingAddress, setShippingAddress] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('')
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { setCart, CountCart } = CartData();
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCartPay] = useState([]);
    const [order, setOrder] = useState(false);
    useEffect(() => {
        setCurrentTitle('Tiến hành thanh toán')
    }, [setCurrentTitle]);
    const calculateTotal = useMemo (() => {
        return cart.reduce((total, item) => {
            return total + item.quantity * item.price;
        }, 0);
    }, [cart]);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const { data } = await axios.get('https://provinces.open-api.vn/api/p/');
                setProvinces(data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);
    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const { data } = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
                    setDistricts(data.districts);
                    setCommunes([]);
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            }
        };
        fetchDistricts();
    }, [selectedProvince]);
    useEffect(() => {
        const fetchCommunes = async () => {
            if (selectedDistrict) {
                try {
                    const { data } = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
                    setCommunes(data.wards);
                } catch (error) {
                    console.error("Error fetching communes:", error);
                }
            }
        };
        fetchCommunes();
    }, [selectedDistrict]);
    const fetchShippingAddress = async () => {
        try {
            const res = await axios.get(api + 'address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShippingAddress(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedAddress(res.data.data[0]);
            }
        } catch (error) {
            console.error("Error fetching shipping address:", error);
        }
    };

    useEffect(() => {
        if (token)
        {
            fetchShippingAddress();
        };
    }, [token]);

    const handleSubmit = async () => {
        if (!name || !phone || !selectedProvince || !selectedDistrict || !selectedCommune || !address) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        try {
            const res = await axios.post(
                api + 'createAddress/',
                {
                    name,
                    phone,
                    province: selectedProvince,
                    district: selectedDistrict,
                    ward: selectedCommune,
                    address,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Địa chỉ mới đã được thêm thành công!");
            fetchShippingAddress();
            setName('');
            setPhone('');
            setAddress('');
            setSelectedProvince('');
            setSelectedDistrict('');
            setSelectedCommune('');
            setShowAddressForm(false);
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Có lỗi xảy ra khi thêm địa chỉ!");
        }
    };
    useEffect(() => {
        const savedAddress = localStorage.getItem('selectedAddress');
        if (savedAddress) {
            const addressFromStorage = JSON.parse(savedAddress);
            // Kiểm tra nếu địa chỉ trong localStorage có tồn tại trong danh sách địa chỉ
            const isAddressValid = shippingAddress.some(address => address.id === addressFromStorage.id);
            if (isAddressValid) {
                setSelectedAddress(addressFromStorage);
            }
        }
    }, [shippingAddress]); // Nếu shippingAddress thay đổi, useEffect sẽ chạy lại

    // Hàm xử lý thay đổi địa chỉ
    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        localStorage.setItem('selectedAddress', JSON.stringify(address));
    };
    const viewCartPayment = async () => {
        try {
            const res = await axios.get(api + 'viewCartPayment',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setCartPay(res.data?.data?.cart_items || []);
        } catch (error) {
            
        }
    }
    useEffect(() => {
        viewCartPayment();
    }, []);
    console.log(cart);
    const AddressForm = () => (
        <div className="p-6 text-xs">
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                placeholder="Họ và tên"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                placeholder="Số điện thoại"
                            />
                        </div>
                    </div>
    
                    <div>
                        <input
                            type="text"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Địa chỉ cụ thể"
                        />
                    </div>
    
                    <div className="grid grid-cols-3 gap-4">
                        <select
                            name="selectedProvince"
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Tỉnh/Thành phố</option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
    
                        <select
                            name="selectedDistrict"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            disabled={!selectedProvince}
                        >
                            <option value="">Quận/Huyện</option>
                            {districts.map((district) => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
    
                        <select
                            name="selectedCommune"
                            value={selectedCommune}
                            onChange={(e) => setSelectedCommune(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                            disabled={!selectedDistrict}
                        >
                            <option value="">Phường/Xã</option>
                            {communes.map((commune) => (
                                <option key={commune.code} value={commune.code}>
                                    {commune.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </form>
        </div>
    );
    const AddressModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-xs">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
                // setShowAddressModal(false);
                // setShowAddressForm(false);
            }}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-sm">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-medium">{showAddressForm ? 'Thêm Địa Chỉ Mới' : 'Địa Chỉ Của Tôi'}</h3>
                    <button 
                        onClick={() => {
                            setShowAddressModal(false);
                            setShowAddressForm(false);
                        }} 
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {!showAddressForm ? (
                        <div className="p-6">
                            {shippingAddress.map((address) => (
                                <div key={address.id} className="mb-4 p-4 border rounded hover:border-red-500 cursor-pointer">
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddress?.id === address.id}
                                            onChange={() => handleAddressChange(address)}
                                            className="mr-3"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    <span className="font-medium">{address.name}</span>
                                                    <span className="text-gray-600">(+84) {address.phone}</span>
                                                </div>
                                                {address.is_default && (
                                                    <span className="text-red-500 border border-red-500 px-2 py-0.5 text-xs rounded">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mt-1">
                                                {address.address}, {address.ward_name}, {address.district_name}, {address.province_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button 
                                onClick={() => setShowAddressForm(true)}
                                className="w-full p-3 border-2 border-dashed border-gray-300 rounded text-blue-600 hover:border-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
                            >
                                <span>+</span>
                                Thêm Địa Chỉ Mới
                            </button>
                        </div>
                    ) : (
                        <AddressForm />
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-4 p-4 border-t">
                    <button
                        onClick={() => {
                            if (showAddressForm) {
                                setShowAddressForm(false);
                            } else {
                                setShowAddressModal(false);
                            }
                        }}
                        className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Trở Lại
                    </button>
                    <button
                        onClick={showAddressForm ? handleSubmit : () => {
                            setShowAddressModal(false);
                            setShowAddressForm(false);
                        }}
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        {showAddressForm ? 'Hoàn thành' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        if (cart.length === 0) {
            toast.error("Giỏ hàng trống!");
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await axios.post(
                api + 'checkout',
                {
                    shipping_address_id: selectedAddress.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.status === 'success') {
                toast.success("Đặt hàng thành công!");
                navigate('/profiles/Delivery-history');
                setCart();
                CountCart();
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Có lỗi xảy ra khi đặt hàng!");
            } else {
                toast.error("Không thể kết nối đến server!");
            }
            console.error("Checkout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Giả lập quá trình tải dữ liệu mất 2 giây
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
        }, 1000);

        return () => clearTimeout(timer); // Xóa bộ hẹn giờ khi component bị unmount
    }, []);

    if (isInitialLoading) {
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
    const Order = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative w-full max-w-2xl rounded-lg shadow-2xl animate-bounce-in">
                    <p className="text-center text-white text-lg font-semibold animate-pulse">
                        Đang đặt hàng...
                    </p>
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className="bg-gray-100 py-3">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="text-sm text-gray-600">Tiến hành thanh toán</div>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 mb-28">
                <div className="bg-gray-100 p-2 lg:p-5 mt-5">
                    <div className="flex items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-red-600" />
                        <h2>Địa chỉ nhận hàng</h2>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <div>
                            {selectedAddress ? (
                                <div className="text-gray-700">
                                    <span className="font-medium mr-2">{selectedAddress.name}</span>
                                    <span className="mr-2">(+84) {selectedAddress.phone}</span>
                                    <span>{selectedAddress.address}, {selectedAddress.ward_name}, {selectedAddress.district_name}, {selectedAddress.province_name}</span>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">Chưa có địa chỉ</div>
                            )}
                        </div>
                        <div className="inline-block">
                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="text-blue-500 w-full hover:text-blue-700"
                            >
                                Thay đổi
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto mt-5">
                    <div className="overflow-x-auto shadow-lg">
                        <table className="w-full bg-white text-xs lg:text-lg">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Hình ảnh
                                    </th>
                                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Sản phẩm
                                    </th>
                                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Màu sắc
                                    </th>
                                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Số lượng
                                    </th>
                                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Giá
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cart.map(item => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="py-3 px-3 text-center">
                                            <div className="w-24 h-24 flex justify-center items-center relative overflow-hidden rounded-lg">
                                                <img
                                                    src={src + `imgProduct/${item.product.images}`}
                                                    alt={item.product.product_name}
                                                    className="h-full w-full object-cover transform hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <p className="font-sans text-gray-900 line-clamp-4">
                                                {item.product.product_name}
                                            </p>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            {item.colors?.color ? (
                                                <span className="bg-gray-300 px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-lg rounded-lg" style={{ color: item.colors.color }}>
                                                    {item.colors.color}
                                                </span>
                                            ): <span className="font-semibold">None</span>}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="text-lg font-medium text-gray-700">
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="text-gray-900">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(item.price)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="my-5 bg-gray-100 pr-5 py-4">
                    <div className="flex justify-end mb-5">
                        Tổng tiền: {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(calculateTotal)}
                    </div>
                    <div className="flex justify-end" onClick={() => setOrder(true)}>
                        <button 
                            onClick={handleCheckout}
                            className={`${isLoading ? "py-3 px-12 bg-[#ee8d2d] text-white" : "py-3 px-12 bg-[#ee4d2d] text-white hover:bg-[#ee5d3d"} lg:text-lg text-sm `}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đặt hàng...' : 'Đặt hàng'}
                        </button>
                    </div>
                </div>
                {showAddressModal && <AddressModal />}
                {order && <Order/>}
            </div>
        </>
    );
}

export default Payment;