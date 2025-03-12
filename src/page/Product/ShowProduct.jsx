import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import { useDataProduct } from "../../Context/ProductContext";
import { useData } from "../../Context/DataContext";
import { CartData } from "../../Context/CartContext";
import FooterProduct from "./FooterProduct";
import Related_Product from "./Component/Related_Product";
import ProductShowImage from "./Component/ProductImage";
import ProductDes from "./Component/ProductDes";
import { CommentSystem } from "./comments/Comment";
import RatingProduct from "./comments/RatingProduct";
import { FaShoppingBag } from "react-icons/fa";

function ShowProduct({ setCurrentTitle }) {
    const { product, loading, setId_product, relatedProducts, setProduct } = useDataProduct();
    const { category, brand } = useData();
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const { handleAddToCart } = CartData();
    const handleQuantityChange = (value) => {
        setQuantity((prev) => Math.max(1, prev + value));
    };
    const getFirstViewedProduct = () => {
        let viewedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];
        if (viewedProducts.length > 0) {
            return viewedProducts[0];
        }
        return null;
    };
    // Gọi hàm để lấy sản phẩm đầu tiên
    const firstProduct = getFirstViewedProduct();
    console.log(product)
    useEffect(() => {
        if (firstProduct) {
            setId_product(firstProduct.id);
            setCurrentTitle(`Product: ${firstProduct.product_name}`);
        }
    }, [firstProduct, setId_product, setCurrentTitle]);  // Cập nhật dependency list đúng
    
    // Đặt màu đầu tiên có sẵn
    useEffect(() => {
        if (!product || !product.colors || product.colors.length === 0) {
            return;  // Nếu không có product hoặc không có màu, không làm gì cả
        }
    
        const firstAvailableColor = product.colors.find(
            (item) => item.quantity > 0 && item.color !== null
        );
    
        setSelectedColor(firstAvailableColor ? firstAvailableColor.color : null);
    }, [product]);
    
    
    const Breadcrumb = () => {
        const cateName = category.find((item) => item.id === product?.category_id);
        const brandItem = brand.find((item) => item.id === product?.brand_id);
    
        return (
            <div className="bg-gray-100 py-3">
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className="text-sm text-gray-600">
                        Trang chủ 
                        / <Link to={'/product'}>Sản phẩm</Link>
                        / <Link to={`/product-category/${cateName?.category_name}`}>
                            {cateName?.category_name || "Không xác định"}
                        </Link>
                        <Link to={`/product-category/brand/${brandItem?.brand_name}`}>
                            / {brandItem?.brand_name || "Không xác định"}
                        </Link>
                        / {product?.product_name || "Đang tải..."}
                    </div>
                </div>
            </div>
        );
    };
    const handleCartAction = async (redirectToCart = false) => {
        if (quantity > 5) {
            toast.warning('Số lượng không được lớn hơn 5');
            return;
        }
        const message = await handleAddToCart(product.id, selectedColor, quantity);
        if (message === "User is not logged in.") {
            toast.warning("Vui lòng đăng nhập để tiếp tục mua sắm!!!");
            navigate('/login');
        } else if (message) {
            toast.success(message);
            if (redirectToCart) {
                navigate('/cart');
            }
        }
    };
    
    // Kiểm tra loading và product
    if (loading || !product) {
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
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Breadcrumb />
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 bg-white shadow-lg">
                        <div className="col-span-1 -mt-20 sm:mt-8 md:-mt-2 xl:mt-0">
                            <ProductShowImage product={product} />
                        </div>
                        <div className="col-span-1 -mt-28 md:mt-0">
                            <div className="p-6 space-y-6">
                                <div className="">
                                    <h1 className="text-3xl text-gray-900">{product.product_name}</h1>
                                </div>
                                <div className="product-detail-container p-4 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="mb-3">
                                        <div className="mb-3 md:mb-4">
                                            {product.discount && new Date(product.discount.end_date) > new Date() ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-red-600">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price * (1 - product.discount.discount_value / 100))}
                                                    </span>
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-lg font-bold text-gray-800">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <p className="ml-2 text-sm text-gray-600 mr-1">{product.reviewCount} Đánh giá: </p>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const isFullStar = product.ratings_avg_rating >= star; // Đánh giá lớn hơn hoặc bằng sao hiện tại
                                                const isHalfStar = product.ratings_avg_rating >= star - 0.5 && product.ratings_avg_rating < star; // Nửa sao

                                                return (
                                                    <svg
                                                        key={star}
                                                        className={`w-5 h-5 ${isFullStar ? 'text-yellow-400' : isHalfStar ? 'text-yellow-200' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                    </svg>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {product.colors && product.colors.length > 0 && (
                                        <div className="mb-5">
                                            {/* <p className="text-sm font-medium text-gray-700 mb-2">Màu sắc:</p> */}
                                            <div className="flex flex-wrap gap-3">
                                                {product.colors
                                                    .filter(item => item.color !== "None")
                                                    .map((item, index) => (
                                                        <button
                                                            key={index}
                                                            className={`text-sm px-4 py-2 rounded-md transition-all
                                                            ${selectedColor === item.color 
                                                                ? 'bg-red-50 border-2 border-red-500 text-red-600 font-medium' 
                                                                : 'border border-gray-300 hover:bg-gray-50'} 
                                                            ${item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={() => {
                                                                if (item.quantity > 0) {
                                                                    setSelectedColor(item.color);
                                                                }
                                                            }}
                                                            disabled={item.quantity === 0}
                                                        >
                                                            {item.color}
                                                            {item.quantity === 0 && <span className="ml-1 text-xs">(Hết hàng)</span>}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-5">
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <p className="text-sm font-semibold text-gray-800 mb-2">Ưu đãi đặc biệt:</p>
                                            <ul className="space-y-2">
                                                <li className="flex items-start">
                                                    <span className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-sm">Giảm thêm 500.000đ khi thanh toán qua VNPay</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-sm">Trả góp 0% trong 6 tháng</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="flex-shrink-0 h-5 w-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-sm">Bảo hành chính hãng 12 tháng</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 sm:row">
                                        <div className="items-center border px-5 py-3 lg:px-3 lg:py-3 sm:flex-row hidden l:flex">
                                            <button
                                                className="text-gray-500 hover:text-gray-800"
                                                onClick={() => handleQuantityChange(-1)}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
                                                className="w-12 text-center border-none focus:outline-none"
                                            />
                                            <button
                                                className="text-gray-500 hover:text-gray-800"
                                                onClick={() => handleQuantityChange(1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className="flex items-center justify-center gap-1 text-[#ee4d2d] bg-[#ff57221a] border border-red-600 py-2 px-4 sm:py-3"
                                            onClick={() => handleCartAction(false)}
                                        >
                                            <BsCartPlus size={18} className="sm:text-[25px] text-[18px] text-red-500" />
                                            <span className="text-center text-sm sm:text-base hidden xl:block">Thêm vào giỏ</span>
                                        </button>

                                        <button
                                            className="bg-[#ee4d2d] text-white py-2 px-4 sm:py-3 sm:px-6 hover:bg-[#ee2d1d] transition-colors font-medium w-full sm:w-auto"
                                            onClick={() => handleCartAction(true)}
                                        >
                                            <span className="text-center text-sm sm:text-base">Mua Ngay</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="block sm:hidden border-t border-gray-200 p-3">
                                <div className="flex items-center text-gray-600 text-xs">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                Giao hàng miễn phí toàn quốc
                                </div>
                            </div>
                            <div className="hidden sm:flex sm:justify-between sm:items-center text-sm text-gray-600 mt-2 px-1">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    Giao hàng miễn phí toàn quốc
                                </div>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Đổi trả trong 7 ngày
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProductDes product={product} />
                </div>
                <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                        <div className='lg:col-span-2'>
                            <CommentSystem product={product} setProduct={setProduct} />
                        </div>
                        <div className='lg:col-span-1'>
                            <RatingProduct product={product} setProduct={setProduct} />
                        </div>
                    </div>
                    <Related_Product relatedProducts={relatedProducts} setId_product={setId_product}/>
                </div>
                <FooterProduct />
            </div>
        </>
    );
}
export default ShowProduct;
