import { useState, useEffect, useMemo } from "react";
import { FaEdit, FaMapMarkerAlt, FaShieldAlt, FaShoppingBag, FaShoppingCart, FaTicketAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CartData } from "../../../Context/CartContext";
import { api, src } from "../../../Api";
import cod from "../../../assets/checkout/cod.png";
import vnPay from "../../../assets/checkout/vnpay.png";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
    const { setCart, CountCart, calculateTotalDiscount, calculateTotal, totalToPay } = CartData();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCartPay] = useState([]);
    const [order, setOrder] = useState(false);
    const [loadedImages, setLoadedImages] = useState({});
    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };
    console.log(calculateTotalDiscount)
    const [selectedPayment, setSelectedPayment] = useState("cod"); // Mặc định là COD
    useEffect(() => {
        setCurrentTitle('Tiến hành thanh toán')
    }, [setCurrentTitle]);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(calculateTotal); // Giá sau giảm giá
    // Cập nhật giá sau giảm khi giỏ hàng thay đổi
    useEffect(() => {
        setFinalPrice(calculateTotal);
    }, [calculateTotal]);
    // Hàm áp dụng mã giảm giá
    const applyCoupon = async () => {
        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/applyCoupon",
                {
                    code: couponCode,
                    cart_total: calculateTotal, // Tổng tiền giỏ hàng
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Gửi token trong request
                    },
                }
            );

            if (res.data.success) {
                setDiscount(res.data.discount);
                setFinalPrice(res.data.final_price);
            }
            toast.error(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error applying coupon:", error.response.data.message);
            setDiscount(0);
            setFinalPrice(calculateTotal);
        }
    };

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
    console.log(typeof discount, discount); 
    console.log(typeof calculateTotalDiscount, calculateTotalDiscount);
    
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
            setIsLoading(true)
            const res = await axios.get(api + 'viewCartPayment',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setCartPay(res.data?.data?.cart_items || []);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        viewCartPayment();
    }, []);
    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <FaShoppingBag className="text-blue-500 text-lg" />
                    </div>
                </div>
            </div>
        );
    }
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
                    payment_method: selectedPayment,
                    coupon: couponCode
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
                // Nếu chọn VNPay, điều hướng đến trang thanh toán
                if (selectedPayment === 'Online' && response.data.vnpay_url) {
                    window.location.href = response.data.vnpay_url; // Chuyển hướng sang VNPay
                    toast.success("Thanh toán thành công")
                    return;
                }
    
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
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-4 border-b border-gray-200">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="flex items-center gap-2">
                        <FaShoppingCart className="text-orange-500" />
                        <h1 className="text-xl font-medium text-gray-800">Tiến hành thanh toán</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 my-8 md:flex md:gap-6">
            {/* Left column - Products and Delivery */}
                <div className="md:w-2/3">
                    {/* Địa chỉ nhận hàng */}
                    <div className="bg-white shadow-sm rounded-lg p-5 mb-6 border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4 border-b pb-3">
                            <div className="bg-red-100 p-2 rounded-full">
                                <FaMapMarkerAlt className="text-red-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Địa chỉ nhận hàng</h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-700">
                            {selectedAddress ? (
                                <div className="mb-3 sm:mb-0">
                                    <div className="flex items-center mb-2">
                                        <span className="font-medium text-gray-900 mr-2">{selectedAddress.name}</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Mặc định</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        (+84) {selectedAddress.phone}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {selectedAddress.address}, {selectedAddress.ward_name}, {selectedAddress.district_name}, {selectedAddress.province_name}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 mb-3 sm:mb-0">Chưa có địa chỉ</div>
                            )}
                            <button 
                                onClick={() => setShowAddressModal(true)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 py-2 px-3 rounded-md transition"
                            >
                                <FaEdit className="text-blue-500" />
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    {/* Bảng sản phẩm */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition mb-6">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Sản phẩm đã chọn</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm lg:text-base">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-700">
                                        <th className="py-3 px-4 text-left font-medium border-b">Sản phẩm</th>
                                        <th className="py-3 px-4 text-center font-medium border-b">Màu sắc</th>
                                        <th className="py-3 px-4 text-center font-medium border-b">Số lượng</th>
                                        <th className="py-3 px-4 text-right font-medium border-b">Giá</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cart.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
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
                                                <div className="font-medium text-gray-800">{item.product.product_name}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {item.colors?.color ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        <span 
                                                        className="w-3 h-3 rounded-full mr-1.5" 
                                                        style={{ backgroundColor: item.colors.color }}
                                                        ></span>
                                                        {item.colors.color}
                                                    </span>
                                                    ) : (
                                                    <span className="text-gray-500">-</span>
                                                    )}
                                            </td>
                                            <td className="py-4 px-4 text-center font-medium">{item.quantity}</td>
                                            <td className="py-4 px-4 text-right font-semibold text-gray-900">
                                                {item.product.discount && new Date(item.product.discount.end_date) > new Date() ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-red-500 font-bold text-lg">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(
                                                                item.product.price * (1 - item.product.discount.discount_value / 100)
                                                            )}
                                                        </span>
                                                        <span className="line-through text-gray-500 text-sm mt-1">
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }).format(item.product.price)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-lg">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }).format(item.product.price)}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                
                    {/* Voucher */}
                    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100 hover:shadow-md transition mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <FaTicketAlt className="text-yellow-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Chọn voucher</h2>
                        </div>
                        <div className="flex items-center border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50">
                            <input
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                type="text"
                                placeholder="Nhập mã giảm giá"
                                className="flex-grow bg-transparent outline-none text-gray-700"
                            />
                            <button 
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded transition"
                                onClick={applyCoupon}>
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>

            {/* Right column - Payment Summary */}
            <div className="md:w-1/3 mt-6 md:mt-0">
                <div className="sticky top-6">
                    {/* Phương thức thanh toán */}
                    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100 hover:shadow-md transition mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Phương thức thanh toán</h2>
                            <div className="space-y-4">
                                {/* Thanh toán khi nhận hàng */}
                                <label 
                                    htmlFor="cod" 
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedPayment === "cod" ? "bg-orange-50 border border-orange-200" : "border border-gray-200 hover:bg-gray-50"}`}
                                >
                                    <input 
                                        type="radio" 
                                        id="cod" 
                                        name="payment" 
                                        className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
                                        checked={selectedPayment === "cod"}
                                        onChange={() => setSelectedPayment("cod")}
                                    />
                                    <div className="bg-gray-100 p-2 rounded">
                                        <img src={cod} alt="cod" className="h-[30px] w-[30px]" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">Thanh toán khi nhận hàng</div>
                                        <div className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                                    </div>
                                </label>

                                {/* Thanh toán VNPay */}
                                <label 
                                    htmlFor="Online" 
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedPayment === "Online" ? "bg-orange-50 border border-orange-200" : "border border-gray-200 hover:bg-gray-50"}`}
                                >
                                    <input 
                                        type="radio" 
                                        id="Online" 
                                        name="payment" 
                                        className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
                                        checked={selectedPayment === "Online"}
                                        onChange={() => setSelectedPayment("Online")}
                                    />
                                    <div className="bg-gray-100 p-2 rounded">
                                        <img src={vnPay} alt="vnpay" className="h-[30px] w-[30px]" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">Thanh toán VNPay</div>
                                        <div className="text-xs text-gray-500">Thanh toán an toàn qua cổng VNPay</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Tổng tiền + Đặt hàng */}
                        <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100 hover:shadow-md transition">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Tổng thanh toán</h2>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-700">
                                    <span>Tạm tính:</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(calculateTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Phí vận chuyển:</span>
                                    <span>0 ₫</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Giảm giá:</span>
                                    <span className="text-green-600 font-bold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(discount > 0 ? Number(discount) + calculateTotalDiscount : calculateTotalDiscount)}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Tổng tiền:</span>
                                    <span className="text-red-600">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(totalToPay - discount)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    (Đã bao gồm VAT nếu có)
                                </div>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                className={`w-full py-3 px-6 text-white text-base font-medium rounded-lg transition flex items-center justify-center gap-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingBag />
                                        <span>Đặt hàng ngay</span>
                                    </>
                                )}
                            </button>
                
                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                                <FaShieldAlt />
                                <span>Thanh toán an toàn & bảo mật</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAddressModal && <AddressModal />}
            {order && <Order />}
        </>
    );
}

export default Payment;