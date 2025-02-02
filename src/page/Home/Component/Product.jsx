import axios from "axios";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import { FaEye } from "react-icons/fa";
import { useDataProduct } from "../../../Context/ProductContext";

// Nút mũi tên quay lại
function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            className="custom-prev-arrow absolute top-1/2 left-[-30px] transform -translate-y-1/2 bg-gray-200 shadow-md hover:bg-gray-300 text-gray-700 p-3 rounded-full focus:outline-none transition-all duration-200 ease-in-out hidden xl:block"
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
            className="custom-next-arrow absolute top-1/2 right-[-30px] transform -translate-y-1/2 bg-gray-200 shadow-md hover:bg-gray-300 text-gray-700 p-3 rounded-full focus:outline-none transition-all duration-200 ease-in-out hidden xl:block"
            style={{ zIndex: 1000 }}
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

    const fetchIncrementProduct = async () => {
        try {
            const result = await axios.get("http://127.0.0.1:8000/api/incrementProduct");
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
            const result = await axios.get("http://127.0.0.1:8000/api/ProductNew");
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
                    slidesToShow: 2,
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
    const handleProduct = (id, product_name) => {
        localStorage.setItem("productShow", id);
        localStorage.setItem("productShowName", product_name);
        setId_product(id);
    };
    return (
        <>
            <div className="bg-slate-50 mb-32 rounded-lg">
                <h1 className=" text-3xl font-semibold text-gray-800 py-6 ml-6">
                    Sản phẩm nổi bật
                </h1>
                <Slider {...settings}>
                    {incrementProduct.map((item) => (
                        <div key={item.id} className="p-3 hover:border hover:border-gray-200 bg-white rounded-lg">
                            <a
                                href={`/product/${encodeURIComponent(item.product_name)}`}
                                onClick={() => handleProduct(item.id, item.product_name)}
                                className="block"
                            >
                                <div className="w-full">
                                    <div className="aspect-w-1 aspect-h-1 overflow-hidden mt-10">
                                        <img
                                            src={`http://127.0.0.1:8000/imgProduct/${item.images}`}
                                            alt={item.product_name}
                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <h3
                                        className="text-center mt-4 text-blue-500 lg:text-lg"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 3, // Hiển thị tối đa 3 dòng
                                            overflow: "hidden",
                                            minHeight: "4.5rem", // Đảm bảo chiều cao tối thiểu là 3 dòng
                                            lineHeight: "1.5rem", // Đặt chiều cao của từng dòng
                                        }}
                                    >
                                        {item.product_name}
                                    </h3>
                                    <p className="text-lg font-bold text-center">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(item.price)}
                                    </p>
                                    <div className="flex items-center justify-center space-x-1 bg-black bg-opacity-10 py-2">
                                        <p className="text-sm text-gray-600">Lượt xem: {item.views}</p>
                                        <FaEye className="text-gray-600" />
                                    </div>
                                </div>
                            </a>

                        </div>
                    ))}
                </Slider>
            </div>
            <div className="bg-slate-50 mb-32 rounded-lg">
                <h1 className=" text-3xl font-semibold text-gray-800 py-6 ml-6">
                    Sản phẩm mới nhất
                </h1>
                <Slider {...settings}>
                    {newProduct.map((item) => (
                        <div key={item.id} className="p-3 hover:border hover:border-gray-200 bg-white rounded-lg">
                            <a
                                href={`/product/${encodeURIComponent(item.product_name)}`}
                                onClick={() => handleProduct(item.id, item.product_name)}
                                className="block"
                            >
                                <div className="w-full">
                                    <div className="aspect-w-1 aspect-h-1 overflow-hidden mt-10">
                                        <img
                                            src={`http://127.0.0.1:8000/imgProduct/${item.images}`}
                                            alt={item.product_name}
                                            className="object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <h3
                                        className="text-center mt-4 text-blue-500 lg:text-lg"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 3, // Hiển thị tối đa 3 dòng
                                            overflow: "hidden",
                                            minHeight: "4.5rem", // Đảm bảo chiều cao tối thiểu là 3 dòng
                                            lineHeight: "1.5rem", // Đặt chiều cao của từng dòng
                                        }}
                                    >
                                        {item.product_name}
                                    </h3>
                                    <p className="text-lg font-bold text-center">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(item.price)}
                                    </p>
                                    <div className="bg-gray-100 rounded-xl gap-2 my-1 mx-2 md:my-2 md:mx-3 xl:my-3 xl:mx-4">
                                        <p className="p-2 text-sm">
                                            Giao hàng miễn phí. Bảo hành chính hãng
                                        </p>
                                    </div>
                                </div>
                            </a>

                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
}

export default Product;
