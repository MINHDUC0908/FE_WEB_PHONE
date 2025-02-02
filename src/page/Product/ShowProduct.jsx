import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import { useDataProduct } from "../../Context/ProductContext";
import { useData } from "../../Context/DataContext";
import { CartData } from "../../Context/CartContext";



function ShowProduct({ setCurrentTitle }) {
    const { product, loading, setId_product } = useDataProduct();
    const { category, brand } = useData();
    const [categoryName, setCategoryName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const { handleAddToCart } = CartData();
    const handleQuantityChange = (value) => {
        setQuantity((prev) => Math.max(1, prev + value));
    };
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
            const initializeProduct = () => {
            const product_local = localStorage.getItem("productShow");
            const productShowName = localStorage.getItem("productShowName");

            if (product_local) {
                setId_product(product_local);
            }
            if (productShowName) {
                setCurrentTitle(`Product: ${productShowName}`);
            }
        };

        initializeProduct();
    }, [setId_product, setCurrentTitle]);

    // Set category and brand names based on the product
    useEffect(() => {
        const cateName = category.find((item) => item.id === product.category_id);
        const brandItem = brand.find((item) => item.id === product.brand_id);

        if (cateName && brandItem) {
            setCategoryName(cateName.category_name);
            setBrandName(brandItem.brand_name);
        }
    }, [product, category, brand]);

    
    // Đặt màu đầu tiên có sẵn
    useEffect(() => {
        if (product && product.colors && product.colors.length > 0) {
            // Tìm màu đầu tiên có quantity > 0 và color không phải null
            const firstAvailableColor = product.colors.find(item => item.quantity > 0 && item.color !== null);
    
            // Nếu tìm thấy màu hợp lệ, set màu đó
            if (firstAvailableColor) {
                setSelectedColor(firstAvailableColor.color);
            } else {
                // Nếu không tìm thấy màu hợp lệ, set selectedColor là chuỗi rỗng
                setSelectedColor("");
            }
        } else {
            // Nếu không có màu hoặc không có colors, không set gì
            setSelectedColor("");
        }
    }, [product]);
    
    

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Breadcrumb component
    const Breadcrumb = () => (
        <div className="bg-gray-100 py-3">
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <div className="text-sm text-gray-600">
                    Trang chủ 
                    / <Link to={'/product'}>Sản phẩm </Link>
                    / <Link to={`/product-category/${categoryName}`}>{categoryName}</Link>
                    <Link to={`/product-category/brand/${brandName}`}> / {brandName}</Link>
                    / {product.product_name}
                </div>
            </div>
        </div>
    );

    // Product image display
    const ProductImage = () => {
        const [displayedImage, setDisplayedImage] = useState(product.images);
        const [descriptionImages, setDescriptionImages] = useState([]);
        const [currentIndex, setCurrentIndex] = useState(0);

        const handleThumbnailClick = (image, index) => {
            setDisplayedImage(image);
            setCurrentIndex(index);
        };  

        useEffect(() => {
            if (product.description_image && product.description_image.length > 0) {
                try {
                    const parsedImages = JSON.parse(product.description_image);
                    setDescriptionImages(parsedImages);
                } catch (error) {
                    console.error("Error parsing description image:", error);
                }
            }
        }, [product.description_image]);
        useEffect(() => {
            // tất cả ảnh
            const allImages = [product.images, ...descriptionImages];
    
            const interval = setInterval(() => {
                // Chuyển sang ảnh tiếp theo
                const nextIndex = (currentIndex + 1) % allImages.length;
                setDisplayedImage(allImages[nextIndex]);
                setCurrentIndex(nextIndex);
            }, 5000); 
    
            return () => clearInterval(interval);
        }, [currentIndex, descriptionImages, product.images]);
        const handleNextImg = () => {
            const allImages = [product.images, ...descriptionImages];
            const nextIndex = (currentIndex + 1) % allImages.length;
            setDisplayedImage(allImages[nextIndex]);
            setCurrentIndex(nextIndex);
        }
        const handlePrevImg = () => {
            const allImages = [product.images, ...descriptionImages];
            const nextIndex = (currentIndex - 1 + allImages.length) % allImages.length;
            setDisplayedImage(allImages[nextIndex]);
            setCurrentIndex(nextIndex);
        }
    return (
            <div className="h-full">
                <div className="flex items-center justify-center mb-4">
                    {/* <GrLinkPrevious className="cursor-pointer " onClick={() => handlePrevImg()}/> */}
                    <img
                        src={`https://duc-phone.onrender.com/${
                        descriptionImages.includes(displayedImage)
                            ? `imgDescriptionProduct/${displayedImage}`
                            : `imgProduct/${displayedImage}`
                        }`}
                        alt={product.product_name}
                        className="max-w-full h-[500px] object-contain"
                    />
                    {/* <GrLinkNext className="cursor-pointer " onClick={() => handleNextImg()}/> */}
                </div>
                <div className="w-full">
                    <div 
                        className="flex space-x-2 overflow-x-auto scrollbar-hide py-2"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none'
                        }}
                    >
                        {/* Main product image */}
                        <div
                            onClick={() => handleThumbnailClick(product.images, 0)}
                            className={`flex-shrink-0 w-12 sm:w-16 md:w-20 lg:w-24 cursor-pointer rounded-lg overflow-hidden ml-2 ${
                                displayedImage === product.images
                                    ? 'ring-2 ring-blue-500'
                                    : 'ring-1 ring-gray-200 hover:ring-blue-300'
                            }`}
                        >
                            <img
                                src={`https://duc-phone.onrender.com/imgProduct/${product.images}`}
                                alt={product.product_name}
                                className="w-full h-full aspect-square object-cover"
                            />
                        </div>

                        {/* Description images */}
                        {descriptionImages.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => handleThumbnailClick(image.trim(), index + 1)}
                                className={`flex-shrink-0 w-12 sm:w-16 md:w-20 lg:w-24 cursor-pointer rounded-lg overflow-hidden ${
                                    displayedImage === image.trim()
                                        ? 'ring-2 ring-blue-500'
                                        : 'ring-1 ring-gray-200 hover:ring-blue-300'
                                }`}
                            >
                                <img
                                    src={`https://duc-phone.onrender.com/imgDescriptionProduct/${image.trim()}`}
                                    alt={`${product.product_name} description ${index + 1}`}
                                    className="w-full h-full aspect-square object-cover"
                                />
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        );
    };
    const handleAddToCartClick = async () => {
        if (quantity > 5)
        {
            toast.warning('Số lượng không được lớn hơn 5');
            return;
        }
        const message = await handleAddToCart(product.id, selectedColor, quantity);
        if (message === "User is not logged in.") {
            toast.warning("Vui lòng đăng nhập để tiếp tục mua sắm!!!")
            navigate('/login');
        } else if (message) {
            toast.success(message);
        }
    };
    const handleBuyToCartClick = async () => {
        const message = await handleAddToCart(product.id, selectedColor, quantity);
        if (message === "User is not logged in.") {
            navigate('/login');
        } else if (message) {
            toast.success(message);
            navigate('/cart')
        }
    };
    // Kiểm tra loading và product
    if (loading || !product) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative w-full max-w-2xl rounded-lg shadow-2xl animate-bounce-in">
                    <p className="text-center text-white text-lg font-semibold animate-pulse">
                        Đang loading...
                    </p>
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }
    const LIMIT = 800;
    // Nội dung hiển thị
    const content = product.outstanding;
    const truncatedContent = content.length > LIMIT ? content.slice(0, LIMIT) + "..." : content;
  return (
        <div className="min-h-screen bg-gray-50">
            <Breadcrumb />
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-8">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 bg-white shadow-lg">
                    <div className="col-span-1 -mt-20 sm:mt-8 md:-mt-2 xl:mt-0">
                        <ProductImage/>
                    </div>
                    <div className="col-span-1">
                        <div className="p-6 space-y-6">
                            <div className="">
                                <h1 className="text-3xl text-gray-900">{product.product_name}</h1>
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-[#ff3300]">
                                    {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    }).format(product.price)}
                                </p>
                            </div>
                            <hr />
                            <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
                            <hr />
                            <div className="flex gap-2">
                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {product.colors
                                            .filter(item => item.color !== null)  // Lọc những màu không phải null
                                            .map((item, index) => (
                                                <button
                                                    key={index}
                                                    className={`text-sm px-4 py-3 border border-gray-300 
                                                    hover:bg-gray-100 focus:bg-gray-200 
                                                    ${selectedColor === item.color ? 'border-2 border-red-500' : ''} 
                                                    ${item.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => {
                                                        if (item.quantity > 0) {
                                                            setSelectedColor(item.color);
                                                        }
                                                    }}
                                                    disabled={item.quantity === 0}
                                                >
                                                    {item.color}
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <div className="hidden items-center border px-5 py-3 lg:px-3 lg:py-3 sm:block">
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
                                    onClick={() => handleAddToCartClick()}
                                >
                                    <BsCartPlus size={18} className="sm:text-[25px] text-[18px] text-red-500" />
                                    <span className="text-center text-sm sm:text-base hidden sm:block">Thêm vào giỏ</span>
                                </button>
                                <button className="bg-[#ee4d2d] text-white py-2 px-4 sm:py-3 sm:px-6 hover:bg-[#ee2d1d] transition-colors font-medium w-full sm:w-auto"
                                    onClick={() => handleBuyToCartClick()}
                                >
                                    <span className="text-center text-sm sm:text-base">Mua Ngay</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="text-gray-600 bg-white p-4 mt-10 rounded-md shadow-xl">
                    <h2 className="font-bold mb-2">Mô tả sản phẩm</h2>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: isExpanded ? content : truncatedContent,
                        }}
                    />
                    {content.length > LIMIT && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 text-blue-500 hover:underline"
                        >
                            {isExpanded ? "Thu gọn" : "Xem thêm"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShowProduct;
