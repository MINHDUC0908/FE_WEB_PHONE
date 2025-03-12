import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Eye, Package, ShieldCheck, Award } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";
import { src } from "../../../Api";

// Nút mũi tên quay lại
function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            className="custom-prev-arrow absolute top-1/2 left-[-20px] transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100 text-gray-700 p-2 rounded-full focus:outline-none transition-all duration-300 ease-in-out hidden lg:flex items-center justify-center w-10 h-10 border border-gray-200"
            style={{ zIndex: 10 }}
            onClick={onClick}
        >
            <ChevronLeft size={18} />
        </button>
    );
}

// Nút mũi tên tiếp theo
function NextArrow(props) {
    const { onClick } = props;
    return (
        <button
            className="custom-next-arrow absolute top-1/2 right-[-20px] transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100 text-gray-700 p-2 rounded-full focus:outline-none transition-all duration-300 ease-in-out hidden lg:flex items-center justify-center w-10 h-10 border border-gray-200"
            style={{ zIndex: 10 }}
            onClick={onClick}
        >
            <ChevronRight size={18} />
        </button>
    );
}

function Related_Product({ relatedProducts, setId_product }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: relatedProducts.length > 3,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                },
            },
        ],
    };
    const [loadedImages, setLoadedImages] = useState({});
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };

    const handleProduct = (product) => {
        localStorage.setItem("productShow", product.id);
        localStorage.setItem("productShowName", product.product_name);
        setId_product(product.id);
        
        let viewedProducts = JSON.parse(localStorage.getItem("viewedProducts")) || [];
        viewedProducts = viewedProducts.filter(p => p.id !== product.id);
        viewedProducts.unshift(product);
        
        if (viewedProducts.length > 5) {
            viewedProducts.pop();
        }
        
        localStorage.setItem("viewedProducts", JSON.stringify(viewedProducts));
    };
    
    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-10">
            <div className="container mx-auto px-4">
                {relatedProducts.length > 3  && (
                    <div className="flex items-center justify-center mb-8">
                        <div className="h-0.5 bg-gray-200 w-16 mr-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800 relative">
                            <span className="relative z-10">Sản phẩm liên quan</span>
                            <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-100 opacity-40 -z-10"></span>
                        </h2>
                        <div className="h-0.5 bg-gray-200 w-16 ml-4"></div>
                    </div>
                )}
                
                <Slider {...settings} className="related-products-slider -mx-3">
                    {
                        relatedProducts && relatedProducts.length > 3 && (
                            relatedProducts.map((product) => (
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
                                                {product.discount && new Date(product.discount.end_date) > new Date() && (
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
                            ))
                        )
                    }
                </Slider>
            </div>
        </div>
    );
}

export default Related_Product;