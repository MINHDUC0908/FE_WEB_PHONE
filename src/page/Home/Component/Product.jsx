import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import { FaEye } from "react-icons/fa";
import { useDataProduct } from "../../../Context/ProductContext";
import { api, src } from "../../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Award, Eye, Heart, Package, ShieldCheck, ShoppingCart } from "lucide-react";

// Nút mũi tên quay lại
function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            className="custom-prev-arrow absolute top-1/2 left-[-30px] transform -translate-y-1/2 bg-gray-200 shadow-md hover:bg-gray-300 text-gray-700 p-3 rounded-full focus:outline-none transition-all duration-200 ease-in-out hidden xl:block"
            style={{ zIndex: 20 }}
            onClick={onClick}
        >
            <FaChevronLeft size={20} />
        </button>
    );
}

// Nút mũi tên tiếp theo
function NextArrow(props) {
    const { onClick } = props;
    return (
        <button
            className="custom-next-arrow absolute top-1/2 right-[-30px] transform -translate-y-1/2 bg-gray-200 shadow-md hover:bg-gray-300 text-gray-700 p-3 rounded-full focus:outline-none transition-all duration-200 ease-in-out hidden xl:block"
            style={{ zIndex: 20 }}
            onClick={onClick}
        >
            <FaChevronRight size={20} />
        </button>
    );
}

function Product() {
    const [incrementProduct, setIncrementProduct] = useState([]);
    const [newProduct, setNewProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState({});
    const {setId_product} = useDataProduct();
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };
    
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const [incrementResult, newResult] = await Promise.all([
                axios.get(api + "incrementProduct"),
                axios.get(api + "ProductNew")
            ]);
            
            if (incrementResult && incrementResult.data) {
                setIncrementProduct(incrementResult.data.data);
            }
            
            if (newResult && newResult.data) {
                setNewProduct(newResult.data.data);
            }
        } catch (error) {
            console.log(error, "Đã xảy ra lỗi khi tải sản phẩm");
        } finally {
            setIsLoading(false);
        }
    }, [api]);
    
    useEffect(() => {
        fetchProducts();
        return () => {
           
        };
    }, [fetchProducts]); 
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [ // Cấu hình cho các kích thước màn hình khác nhau
            {
                breakpoint: 10000, // Màn hình lớn hơn 10000 pixels
                settings: {
                    slidesToShow: 5, // Hiển thị 3 slide
                    slidesToScroll: 1, // Cuộn 1 slide mỗi lần
                    infinite: true, // Vòng lặp vô hạn
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            }
        ]
    };
    const handleProduct = (product) => {
        let viewedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];
    
        // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách, thì xóa nó đi trước khi thêm mới
        viewedProducts = viewedProducts.filter(p => p.id !== product.id);
    
        // Thêm sản phẩm mới lên đầu danh sách
        viewedProducts.unshift(product);
    
        // Giới hạn số lượng sản phẩm lưu (ví dụ: chỉ lưu 5 sản phẩm gần nhất)
        if (viewedProducts.length > 5) {
            viewedProducts.pop();
        }
    
        localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
    };
    return (
        <>
            <div className="bg-slate-50 my-28 rounded-lg">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-8 border-l-4 border-blue-500 pl-4">
                🌟 Sản phẩm nổi bật
                </h1>
                <div className="pb-12">
                        <Slider {...settings} className="featured-products-slider -mx-2">
                            {incrementProduct.map((product) => (
                                <div key={product.id} className="px-3 py-2">
                                <div 
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
                                    onMouseEnter={() => setHoveredProduct(product.id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                >
                                    <a
                                        href={`/product/${encodeURIComponent(product.product_name)}`}
                                        onClick={() => handleProduct(product)}
                                        className="block relative"
                                    >
                                        <div className="relative overflow-hidden group">
                                            <div className="h-[200px] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                                                <LazyLoadImage
                                                    src={`${src}imgProduct/${product.images}`}
                                                    alt={product.product_name}
                                                    className={`w-full h-full object-contain transition-all duration-500 ${
                                                        loadedImages[product.id] 
                                                            ? "opacity-100 scale-100" 
                                                            : "opacity-0 scale-95"
                                                    } ${hoveredProduct === product.id ? "transform scale-110" : ""}`}
                                                    onLoad={() => handleImageLoad(product.id)}
                                                    loading="lazy"
                                                />
                                            </div>
                                            
                                            {product.discount && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center">
                                                        <Award size={12} className="mr-1" />
                                                        {product.discount.discount_value}%
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-300 text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100">
                                                    <Heart size={16} />
                                                </button>
                                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-300 text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100">
                                                    <ShoppingCart size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </a>
    
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex items-center text-gray-500 text-xs mb-2">
                                            <Eye size={14} className="mr-1" />
                                            <span>{product.views} lượt xem</span>
                                        </div>
                                        
                                        <a
                                            href={`/product/${encodeURIComponent(product.product_name)}`}
                                            onClick={() => handleProduct(product)}
                                            className="group"
                                        >
                                            <h3 className="font-medium text-gray-800 text-sm line-clamp-2 h-10 group-hover:text-blue-600 transition-colors duration-300">
                                                {product.product_name}
                                            </h3>
                                        </a>
                                        
                                        <div className="mt-2 mb-3">
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
                                        <div className="bg-gray-50 rounded-lg p-3 mt-auto border border-gray-100">
                                            <div className="flex items-center text-gray-600 text-xs">
                                                <Package size={14} className="text-green-500 mr-2 flex-shrink-0" />
                                                <p>Giao hàng miễn phí</p>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-xs mt-2">
                                                <ShieldCheck size={14} className="text-green-500 mr-2 flex-shrink-0" />
                                                <p>Bảo hành chính hãng</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 text-center text-sm font-medium transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                                        Xem chi tiết
                                    </div>
                                </div>
                            </div>
                            ))}
                        </Slider>
                    </div>
                </div>                                                
                <div className="bg-slate-50 mb-16 rounded-lg">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-8 border-l-4 border-green-500 pl-4">
                    🆕 Sản phẩm mới nhất
                </h1>
                <div className="pb-12">
                    <Slider {...settings} className="newest-products-slider -mx-2">
                        {newProduct.map((product) => (
                            <div key={product.id} className="px-3">
                                <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 h-full">
                                    <a
                                        href={`/product/${encodeURIComponent(product.product_name)}`}
                                        onClick={() => handleProduct(product)}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="relative group">
                                            <div className="h-[220px] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
                                                <LazyLoadImage
                                                    src={`${src}imgProduct/${product.images}`}
                                                    alt={product.title}
                                                    className={`w-full h-full object-contain transition-all duration-500 ${
                                                        loadedImages[product.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                    }`}
                                                    onLoad={() => handleImageLoad(product.id)}
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        
                                            <div className="absolute top-2 left-2">
                                                <span className="inline-flex items-center bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Mới
                                                </span>
                                            </div>
                                        
                                            {product.discount && new Date(product.discount.end_date) > new Date() && (
                                                <div className="absolute top-2 right-2">
                                                <span className="inline-flex items-center bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    -{product.discount.discount_value}%
                                                </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-medium text-blue-600 text-[14px] line-clamp-2 h-16">
                                                {product.product_name}
                                            </h3>
                                            
                                            <div className="mt-2 mb-3">
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
                                            <div className="bg-gray-50 rounded-lg p-3 mt-auto border border-gray-100">
                                                <div className="flex items-center text-gray-600">
                                                    <div className="hidden lg:block">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-[9px]">Giao hàng miễn phí</p>
                                                </div>
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <div className="hidden lg:block">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-[9px]">Bảo hành chính hãng</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </>
    );
}

export default Product;
