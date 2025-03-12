import img from '../../assets/DUCCOMPUTER.png';
import { TfiBag } from "react-icons/tfi";
import { FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useDataProduct } from '../../Context/ProductContext';
import { UseDataUser } from '../../Context/UserContext';
import { CartData } from '../../Context/CartContext';
import { src } from '../../Api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSearch } from '../../Context/SearchContext';

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
    const handleSearchSubmit = () => {
        const query = search.trim();
        
        if (query.length > 2) {
            navigate(`/search?q=${query}`);
            setTimeout(() => setSearch(""), 100); // Xóa sau khi điều hướng
        }
    };
    
    // Xóa kết quả tìm kiếm khi đóng
    const handleClose = () => {
        setSearch("");
        setLoading(false);
        setResults([]);
    };

    const handleSearch = (id, name) => {
        localStorage.setItem('productShow', id);
        localStorage.setItem('productShowName', name);
    }
    // Xử lý thay đổi input tìm kiếm
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setLoading(true);
        const filteredResults = products.filter(item =>
            item.product_name.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filteredResults);
        setTimeout(() => {
            setLoading(false);
        }, 300);
    };
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
                    <div className="hidden items-center border border-gray-300 overflow-hidden flex-grow mx-10 relative lg:flex">
                        <input
                            type="text"
                            className="border-none outline-none px-2 py-2 w-full placeholder-gray-500"
                            placeholder="Nhập sản phẩm tìm kiếm..."
                            value={search}
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
                            className="bg-yellow-500 text-white px-2 py-2 hover:bg-yellow-600 transition duration-200 whitespace-nowrap">
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

                {/* Kết quả tìm kiếm trên màn hình lớn */}
                {!isLoading && results.length > 0 && search && (
                    <div className="hidden lg:block absolute lg:w-[370px] xl:w-[578px] 2xl:w-[690px] mx-auto left-11 right-24 max-h-[265px] top-[61px] bg-white border border-gray-300 z-10 transition-opacity duration-300 opacity-100 overflow-y-auto">
                        {results.map(item => (
                            <div key={item.id} className="">
                                <hr />
                                <a href={`/product/${item.product_name}`} key={item.id} onClick={() => handleSearch(item.id, item.product_name)}>
                                    <div className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer w-full">
                                        <div className="flex-shrink-0">
                                            <img 
                                                src={`http://127.0.0.1:8000/imgProduct/${item.images}`} 
                                                alt={item.product_name} 
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center pl-4">
                                            <div className="text-xl text-[#0066cc] hover:text-yellow-600 transition-all duration-300 truncate w-[250px]">{item.product_name}</div>
                                            <div className="text-sm text-black">
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