import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import { FaEye } from "react-icons/fa";
import { useDataProduct } from "../../../Context/ProductContext";
import { api, src } from "../../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
    const [lastUpdated, setLastUpdated] = useState(null);
    const {setId_product} = useDataProduct();
    const [loaded, setLoaded] = useState(false);

    const fetchIncrementProduct = async () => {
        try {
            const result = await axios.get(api + "incrementProduct");
            if (result && result.data) {
                const newData = result.data.data;
                if (JSON.stringify(newData) !== JSON.stringify(incrementProduct)) {
                    setIncrementProduct(newData);
                    setLastUpdated(new Date().toISOString());
                }
            }
        } catch (error) {
            console.log(error, "Đã xảy ra lỗi");
        }
    };
    const fetchNewProduct = async () => {
        try {
            const result = await axios.get(api + "ProductNew");
            if (result && result.data) {
                const newData = result.data.data;
                if (JSON.stringify(newData) !== JSON.stringify(newProduct)) {
                    setNewProduct(newData);
                    setLastUpdated(new Date().toISOString());
                }
            }
        } catch (error) {
            console.log(error, "Đã xảy ra lỗi");
        }
    };
    useEffect(() => {
        fetchIncrementProduct();
        fetchNewProduct();
    }, []);
    console.log(newProduct);

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
                                <div key={product.id} className="px-2">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                        <a
                                            href={`/product/${encodeURIComponent(product.product_name)}`}
                                            onClick={() => handleProduct(product)}
                                            className="block h-full"
                                        >
                                            <div className="relative overflow-hidden group">
                                                <div className="h-[220px] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
                                                    <LazyLoadImage
                                                        src={`${src}storage/${product.thumbnail}`}
                                                        alt=""
                                                        className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500"
                                                        style={{ opacity: loaded ? 0 : 0.8 }}
                                                        loading="lazy"
                                                    />
                                                    <LazyLoadImage
                                                        src={loaded ? `${src}imgProduct/${product.images}` : `${src}storage/${product.thumbnail}`}
                                                        alt={product.product_name}
                                                        className="w-full h-full object-contain transition-all duration-500"
                                                        style={{ 
                                                            opacity: loaded ? 1 : 0,
                                                            transform: `scale(${loaded ? 1 : 0.9})`
                                                        }}
                                                        onLoad={() => setLoaded(true)}
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            
                                                {product.discount && (
                                                    <div className="absolute top-3 right-3">
                                                    <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                                                        -{product.discount.discount_value}%
                                                    </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="font-medium text-blue-600 text-[14px] line-clamp-2 h-16">
                                                    {product.product_name}
                                                </h3>
                                                
                                                <div className="text-center flex flex-col justify-center">
                                                    {product.discount ? (
                                                        <>
                                                            <span className="text-xl font-bold text-red-600">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(product.price * (1 - product.discount.discount_value / 100))}
                                                            </span>
                                                            <span className="text-sm text-gray-400 line-through">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(product.price)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-xl font-bold text-gray-800">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(product.price)}
                                                            </span>
                                                            <span className="text-sm text-transparent">
                                                            &nbsp;
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <span className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {product.views}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3 mt-auto border border-gray-100">
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <div className="hidden lg:block">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-[9px]">Giao hàng miễn phí</p>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 text-sm mt-1">
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
                <div className="bg-slate-50 mb-16 rounded-lg">
                <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-8 border-l-4 border-green-500 pl-4">
                    🆕 Sản phẩm mới nhất
                </h1>
                <div className="pb-12">
                    <Slider {...settings} className="newest-products-slider -mx-2">
                        {newProduct.map((product) => (
                            <div key={product.id} className="px-2">
                                <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-gray-100 h-full">
                                    <a
                                        href={`/product/${encodeURIComponent(product.product_name)}`}
                                        onClick={() => handleProduct(product)}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="relative group">
                                            <div className="h-[220px] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
                                                <LazyLoadImage
                                                    src={`${src}storage/${product.thumbnail}`}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500"
                                                    style={{ opacity: loaded ? 0 : 0.8 }}
                                                    loading="lazy"
                                                />
                                                <LazyLoadImage
                                                    src={loaded ? `${src}imgProduct/${product.images}` : `${src}storage/${product.thumbnail}`}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-contain transition-all duration-500"
                                                    style={{ 
                                                        opacity: loaded ? 1 : 0,
                                                        transform: `scale(${loaded ? 1 : 0.9})`
                                                    }}
                                                    onLoad={() => setLoaded(true)}
                                                    loading="lazy"
                                                    aria-hidden={!loaded}
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
                                        
                                            {product.discount && (
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
                                            
                                            <div className="text-center mb-3 h-14 flex flex-col justify-center">
                                                {product.discount ? (
                                                    <>
                                                        <span className="text-xl font-bold text-red-600">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price * (1 - product.discount.discount_value / 100))}
                                                        </span>
                                                        <span className="text-sm text-gray-400 line-through">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xl font-bold text-gray-800">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(product.price)}
                                                        </span>
                                                        <span className="text-sm text-transparent">
                                                        &nbsp;
                                                        </span>
                                                    </>
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
