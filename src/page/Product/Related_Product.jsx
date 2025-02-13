import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";
import { src } from "../../Api";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

// Nút mũi tên quay lại
function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            className="custom-prev-arrow absolute top-1/2 left-[-40px] transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-300 text-gray-700 p-3 rounded-full focus:outline-none transition-all duration-300 ease-in-out hidden xl:flex items-center justify-center w-10 h-10"
            style={{ zIndex: 1000 }}
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
            className="custom-next-arrow absolute top-1/2 right-[-40px] transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-300 text-gray-700 p-3 rounded-full focus:outline-none transition-all duration-300 ease-in-out hidden xl:flex items-center justify-center w-10 h-10"
            style={{ zIndex: 1000 }}
            onClick={onClick}
        >
            <FaChevronRight size={20} />
        </button>
    );
}

function Related_Product({ relatedProducts, setId_product }) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
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
                },
            },
        ],
    };
    const [loaded, setLoaded] = useState(false)
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const handleProduct = (id, product_name) => {
        localStorage.setItem("productShow", id)
        localStorage.setItem("productShowName", product_name)
        setId_product(id);
    }
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 xl:px-10 py-8 bg-white rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sản phẩm liên quan</h2>
                <Slider {...settings}>
                    {relatedProducts && relatedProducts.length > 0 &&
                        relatedProducts.map((product, index) => (
                            <div key={index} className="p-2"                                         
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}>
                                <div className="bg-white border border-red-50 h-[420px] relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                    <button className="absolute top-3 right-3 z-10 bg-white/70 rounded-full p-2 hover:bg-white hover:shadow-md transition-all">
                                        <HeartIcon 
                                            className={`w-5 h-5 ${
                                                hoveredProduct === product.id 
                                                    ? 'text-red-500 fill-current' 
                                                    : 'text-gray-400'
                                            }`} 
                                        />
                                    </button>
                                    <a
                                        href={`/product/${encodeURIComponent(product.product_name)}`}
                                        onClick={() => handleProduct(product.id, product.product_name)}
                                        className="block"
                                    >
                                        <div className="h-[250px] mt-5 flex items-center justify-center p-4 bg-gray-50 relative">
                                            <LazyLoadImage
                                                src={`${src}storage/${product.thumbnail}`}
                                                alt="" 
                                                className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`}
                                                loading="lazy"
                                            />
                                            <LazyLoadImage
                                                src={loaded ? `${src}imgProduct/${product.images}` : `${src}storage/${product.thumbnail}`}  // Ảnh chính thay thế ảnh mờ khi tải xong
                                                alt={product.product_name}  
                                                className={`w-full h-full object-contain transition-opacity duration-500 transform ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} 
                                                onLoad={() => setLoaded(true)}  
                                                loading="lazy"
                                                aria-hidden={!loaded} 
                                            />
                                        </div>

                                        <div className="p-4">
                                            <h3 
                                                className="text-blue-800 font-semibold mb-2 line-clamp-2 h-12"
                                            >
                                                {product.product_name}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold text-red-600">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(product.price)}
                                                </p>
                                                <button 
                                                    className={`p-2 rounded-full transition-all ${
                                                        hoveredProduct === product.id 
                                                            ? 'bg-blue-500 text-white shadow-md' 
                                                            : 'bg-gray-200 text-gray-500'
                                                    }`}
                                                >
                                                    <ShoppingCartIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                        )) 
                    }
                </Slider>
            </div>
        </div>
    );
}

export default Related_Product;
