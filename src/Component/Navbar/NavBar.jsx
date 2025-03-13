import img from '../../assets/DUCCOMPUTER.png';
import { TfiBag } from "react-icons/tfi";
import { FaRegHeart } from "react-icons/fa";
import { useCallback, useRef, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosArrowDown, IoIosCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useDataProduct } from '../../Context/ProductContext';
import { UseDataUser } from '../../Context/UserContext';
import { CartData } from '../../Context/CartContext';
import { src } from '../../Api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSearch } from '../../Context/SearchContext';
import b1 from '../../assets/search/b1.png'
import b2 from '../../assets/search/b2.png'
import b3 from '../../assets/search/b3.png'
import b4 from '../../assets/search/b4.png'
import Slider from 'react-slick';
import { ChevronRight, Search, ShoppingCart, Trash2 } from 'lucide-react';
function NavBar()
{
    const [loaded, setLoaded] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const { products } = useDataProduct(); 
    const {user, loading} = UseDataUser();
    const {count} = CartData();
    const { search, setSearch } = useSearch();
    const  navigate = useNavigate();
    const [history, setHistory] = useState(() => {
        return JSON.parse(localStorage.getItem("searchHistory")) || [];
    });
    const dropdownRef = useRef(null);
    const [visibleHistory, setVisibleHistory] = useState(2);
    const displayedHistory = history.slice(0, visibleHistory);
    const hasMoreHistory = visibleHistory < history.length;
    const handleLoadMore = useCallback((e) => {
        setVisibleHistory(prev => Math.min(prev + 2, history?.length || 0));
      }, [history]);
    const [focus, setFocus] = useState(false)
    const handleSearchSubmit = () => {
        const query = search.trim();
        
        if (query.length > 2) {
            navigate(`/search?q=${query}`);
            setTimeout(() => setSearch(""), 100); // Xóa sau khi điều hướng
        }
    };
    const handleHistoryItem = (id) => {
        const updatedHistory = history.filter(h => h.id !== id);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
    }
    // Xóa kết quả tìm kiếm khi đóng
    const handleClose = () => {
        setSearch("");
        setLoading(false);
        setResults([]);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setFocus(false)
        setLoading(true);
        const filteredResults = products.filter(item =>
            item.product_name.toLowerCase().includes(value.toLowerCase())
        );

        setResults(filteredResults);
        setTimeout(() => {
            setLoading(false);
        }, 300);
    };
    // Xử lý chọn sản phẩm
    const handleProduct = (product) => {
        let viewedProducts = JSON.parse(localStorage.getItem("searchHistory")) || [];
        // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách, thì xóa nó đi trước khi thêm mới
        viewedProducts = viewedProducts.filter(p => p.id !== product.id);
        // Thêm sản phẩm mới lên đầu danh sách
        viewedProducts.unshift(product);
        // Giới hạn số lượng sản phẩm lưu (ví dụ: chỉ lưu 5 sản phẩm gần nhất)
        if (viewedProducts.length > 5) {
            viewedProducts.pop();
        }
    
        localStorage.setItem("searchHistory", JSON.stringify(viewedProducts));
        setHistory(viewedProducts);
    };
    const handleBlur = () => {
        setTimeout(() => setFocus(false), 200);
    };
    const settings = {
        infinite: true,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true
                },
            },
        ]
    };
    const Image = [
        {
            id: 1,
            image: b1,
        },
        {
            id: 2,
            image: b2,
        },
        {
            id: 3,
            image: b3,
        },
        {
            id: 4,
            image: b4,
        },
    ]
    const trendingSearches = [
        "iPhone 16 Pro Max", "iPhone 15", "Laptop", "Carseat", "Pocket 3",
        "iPhone 16 Pro Max", "iPhone 15", "Laptop", "Carseat", "Pocket 3",
    ];
    return (
        <>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <div className="flex items-center justify-between py-5 px-[5px] lg:py-5">
                    {/* Logo */}
                    <div className="text-2xl font-bold flex items-center space-x-2">
                        <a href="/">
                            <img src={img} alt="Logo" className='w-[200px] sm:w-[240px] h-auto' />
                        </a>
                    </div>

                    {/* Tìm kiếm */}
                    <div className="hidden items-center border border-gray-300 rounded-lg overflow-hidden flex-grow mx-10 relative lg:flex shadow-sm hover:shadow-md transition-shadow duration-200">
                        <input
                            type="text"
                            className="border-none outline-none px-2 py-2 w-full placeholder-gray-500 text-sm"
                            placeholder="Nhập sản phẩm tìm kiếm..."
                            value={search}
                            onFocus={() => setFocus(true)}
                            onBlur={handleBlur}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                        />
                        {search && !isLoading &&
                            <button onClick={handleClose}>
                                <IoIosCloseCircle className='absolute right-24 top-3 cursor-pointer' />
                            </button>
                        }
                        {isLoading && (
                            <AiOutlineLoading3Quarters
                                className="absolute top-3 right-24 animate-spin text-gray-600 transition-opacity duration-300 opacity-100"
                            />
                        )}
                        <button
                            onClick={handleSearchSubmit}
                            className="bg-yellow-500 text-white px-3 py-3 hover:bg-yellow-600 transition duration-200 whitespace-nowrap font-medium text-sm"
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    {/* Icons */}
                    <div className='items-center space-x-2 flex sm:space-x-6'>
                        {/* Wishlist Icon */}
                        <div className='relative cursor-pointer hidden lg:flex'>
                            <FaRegHeart className="text-2xl hover:text-yellow-600 transition duration-200" />
                            <span className='absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                {wishlistCount}
                            </span>
                        </div>

                        {/* Cart Icon */}
                        <div className='relative cursor-pointer'>
                            <a href={'/cart'}>
                                <TfiBag className="text-2xl hover:text-yellow-600 transition duration-200 bg-white" />
                                <span className='absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                                    {count}
                                </span>
                            </a>
                        </div>

                        {/* User Icon */}
                        <div className='cursor-pointer hidden lg:flex'>
                            <Link 
                                to={user ? '/profiles/Delivery-history' : '/login'} 
                                className='flex items-center relative'
                            >
                                {loading ? (
                                        <div className='flex items-center'>
                                            <div className="h-[30px] w-[30px] rounded-full flex items-center justify-center text-white font-semibold">
                                                
                                            </div>
                                            <span className="relative ml-1 font-semibold hidden sm:block text-white">Đang tải..</span>
                                        </div>
                                ) : user ? (
                                    <div className="flex items-center">
                                        <div>
                                            {user.image ? (
                                                <LazyLoadImage
                                                    loading="lazy"
                                                    src={`${user.image.includes("http") ? user.image : src + "imgCustomer/" + user.image}`}
                                                    alt="User Avatar"
                                                    className={`h-[30px] w-[30px] rounded-full object-cover transition-opacity duration-500 ${
                                                        loaded ? "opacity-100" : "opacity-0"
                                                    }`}
                                                    onLoad={() => setLoaded(true)}
                                                />
                                            ) : (
                                                <div className="h-[30px] w-[30px] rounded-full bg-blue-700 flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative ml-1 font-semibold hidden sm:block hover:text-yellow-600">
                                            {user.name.split(' ').slice(-2).join(' ')}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex items-center'>
                                        <div className="h-[30px] w-[30px] rounded-full bg-blue-700 flex items-center justify-center text-white font-semibold">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <span className="ml-1 font-semibold hidden sm:block">Đăng nhập</span>
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                { focus && (
                    <div ref={dropdownRef} className="hidden lg:block absolute mx-auto left-11 right-24 top-[61px] bg-white border border-gray-300 shadow-lg rounded-lg z-10 transition-opacity duration-300 opacity-100 overflow-hidden mt-3 lg:w-[370px] xl:w-[578px] 2xl:w-[690px]">
                        <div>
                            <div className="p-4">
                                <Slider {...settings}>
                                    { Image.map(item => (
                                        <img src={item.image} alt="" className="w-full h-auto rounded-lg" key={item.id} />
                                    ))}
                                </Slider>
                            </div>
                            
                            {
                                history && history.length > 0 ? (
                                    <div className="px-4 pb-4">
                                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Sản phẩm đã tìm kiếm</h3>
                                        <div className="divide-y divide-gray-100">
                                            { displayedHistory.map(item => (
                                                <Link to={`/product/${encodeURIComponent(item.product_name)}`} state={{id: item.id}}>
                                                    <div key={item.id} className="flex items-center gap-3 py-3 px-2 hover:bg-blue-50 rounded-md transition-all duration-200 cursor-pointer">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full shadow-sm group-hover:shadow-md transition-all">
                                                            <FaClockRotateLeft size={16} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-montserrat text-[14px] text-gray-800 transition-colors">
                                                                {item.product_name}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault()
                                                                    handleHistoryItem(item.id)
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                                                                title="Xóa sản phẩm"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>   
                                                            <div className="text-gray-400 opacity-0 transition-opacity">
                                                                <ChevronRight size={20} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        {
                                            hasMoreHistory ? (
                                                <div className="flex justify-center mt-6">
                                                    <button
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            handleLoadMore(e);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm 
                                                                    text-gray-700 bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm 
                                                                    hover:shadow-md active:scale-95"
                                                    >
                                                        <IoIosArrowDown className="text-gray-500 text-lg" />
                                                        Xem thêm sản phẩm {history.length - visibleHistory}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center mt-4 cursor-pointer">
                                                    <span
                                                        className="flex items-center gap-2 text-sm font-medium text-gray-600 
                                                                shadow-sm transition-all duration-200 
                                                             active:scale-95"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            localStorage.removeItem("searchHistory");
                                                            setHistory([]);
                                                        }}
                                                    >
                                                        <Trash2 size={18} className="text-red-500" />
                                                        Xóa tất cả
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div>
                                        
                                    </div>
                                )
                            }
                            <div className="bg-white p-4 rounded-lg shadow-lg w-full">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Xu hướng tìm kiếm</h3>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((item, index) => (
                                        <button 
                                            key={index} 
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-300 
                                                    rounded-full hover:bg-gray-100 transition-all"
                                        >
                                            <Search size={16} className="text-gray-500" />
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kết quả tìm kiếm trên màn hình lớn */}
                {!isLoading && results.length > 0 && search && (
                    <div className="hidden lg:block absolute mx-auto left-11 right-24 top-[61px] z-10 max-h-[300px] bg-white shadow-lg rounded-lg border border-gray-300 overflow-y-auto mt-3 transition-all duration-300 w-[90%] lg:w-[370px] xl:w-[578px] 2xl:w-[690px]">
                        <div className="flex items-center px-4 py-3 bg-gray-100 border-b">
                            <Search className="w-5 h-5 text-gray-500" />
                            <span className="ml-2 text-gray-700 font-semibold">Kết quả tìm kiếm</span>
                        </div>
                        {results.map((item, index) => (
                            <div key={item.id} className="">
                                {index > 0 && <hr className="border-gray-200" />}
                                <Link
                                    to={`/product/${item.product_name}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClose();
                                        handleProduct(item);
                                        navigate(`/product/${item.product_name}`, { state: { id: item.id } });
                                    }}
                                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer w-full transition-all duration-200"
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={`http://127.0.0.1:8000/imgProduct/${item.images}`}
                                            alt={item.product_name}
                                            className="w-16 h-16 object-cover rounded-md border border-gray-300"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center pl-4 w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-[14px] text-[#000000] hover:text-yellow-600 transition-all duration-300 
                                                            w-[250px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                                {item.product_name}
                                            </span>
                                            <ShoppingCart className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                        </div>
                                        <div className="text-sm text-black font-semibold">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(item.price)}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tìm kiếm trên di động */}
                <div className="lg:hidden items-center border border-gray-300 overflow-hidden relative flex-grow flex">
                    <input
                        type="text"
                        className="border-none outline-none px-2 py-2 w-full placeholder-gray-500"
                        placeholder="Nhập sản phẩm tìm kiếm..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    {search && !isLoading &&
                        <button onClick={handleClose}>
                            <IoIosCloseCircle className='absolute right-24 top-3 cursor-pointer' />
                        </button>
                    }
                    {isLoading && <AiOutlineLoading3Quarters className='absolute top-3 right-24 animate-spin text-gray-600' />}
                    <button className="bg-yellow-500 text-white px-2 py-2 hover:bg-yellow-600 transition duration-200 whitespace-nowrap">
                        Tìm kiếm
                    </button>
                </div>

                {/* Kết quả tìm kiếm cho phiên bản di động */}
                {!isLoading && results.length > 0 && search && (
                    <div className="lg:hidden block top-[52px] left-0 right-0  bg-white border border-gray-300 z-50 transition-opacity duration-300 opacity-100 max-h-[300px] overflow-y-auto shadow-md">
                        {results.map((item, index) => (
                            <div key={index} className="p-3 hover:bg-gray-100 cursor-pointer w-full">
                                <hr />
                                <a href={`/product/${item.product_name}`} onClick={() => handleSearch(item.id, item.product_name)}>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img 
                                                src={`http://127.0.0.1:8000/imgProduct/${item.images}`} 
                                                alt={item.product_name} 
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <div className="text-sm text-[#0066cc] font-medium truncate w-[200px]">{item.product_name}</div>
                                            <div className="text-xs text-black">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(item.price)}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </>
    )
}
export default NavBar