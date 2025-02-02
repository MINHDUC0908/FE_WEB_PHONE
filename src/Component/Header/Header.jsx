import { FiPhone } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { RiMenuFill } from "react-icons/ri";
import { GoChevronRight } from "react-icons/go";
import { RiProductHuntLine } from "react-icons/ri";
import "./Header.css";
import { useData } from "../../Context/DataContext";
import { useDataGetProduct } from "../../Context/getProductCategory";
import { useDataBanrd } from "../../Context/getProductBrand";
import { UseDataUser } from "../../Context/UserContext";
import { Menu } from "./Menu/Menu";
import { FaRegUser } from "react-icons/fa";
import ResponsiveSideBar from "../../page/Profile/SideBar/ReponsiveSideBar";
import Responsive from "../Navbar/ResponsiveNavBar";

function Header()
{
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(null);
    const [hover, setHover] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenS, setIsOpenS] = useState(false);
    const { category, groupedBrands, brand } = useData();
    const {  setId } = useDataGetProduct();
    const { setId_brand} = useDataBanrd();
    const {user} = UseDataUser();

    const handleMenuClick = (id) => {
        setActiveMenu(id);
    };

    useEffect(() => {
        const currentMenu = Menu.find(item => item.Link === location.pathname);
        setActiveMenu(currentMenu ? currentMenu.id : null);
    }, [location]);

    const handleCategory = (id, category_name) => {
        if (category_name) {
            setId(id);
            console.log(category_name);
            localStorage.setItem('id_category', id);
            localStorage.setItem('category', category_name);
        } else {
            console.error('Category name is undefined or null');
            localStorage.removeItem('id_brand');
            localStorage.removeItem('brandData');
        }
    }
    const handleBrand = (brand_id, brand_name, category_name, category_id) => {
        console.log("Brand ID:", brand_id);
        console.log("Brand Name:", brand_name); 
        
        if (brand_name) {
            setId_brand(brand_id);
            localStorage.setItem('category', category_name)
            localStorage.setItem('id_brand', brand_id);
            localStorage.setItem('brandData', brand_name);
            localStorage.setItem('id_category', category_id)
        } else {
            localStorage.removeItem('id_brand');
            localStorage.removeItem('brandData');
        }
    };
    const toggleSideBar = () => {
        setIsOpenS(!isOpenS); 
        setIsOpen(false);     
    };
    
    const toggleResponsiveMenu = () => {
        setIsOpen(!isOpen);    
        setIsOpenS(false);   
    };
    return (
        <>
            <hr className="hidden lg:block" />
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 hidden sm:block">
                <div className="flex justify-between">
                    {/* Categories with Hover Dropdown */}
                    <div className="relative group flex items-center cursor-pointer" onMouseLeave={() => setHover(false)}>
                        <span className="flex items-center space-x-1 text-gray-800"
                            onMouseEnter={() => setHover(true)} >
                            <span className="py-3 font-semibold font-serif">Danh mục sản phẩm</span>
                            <FaAngleDown className={`transition-all duration-500 ${hover ? "rotate-180" : "rotate-0"}`} />
                        </span>
                        <div onMouseLeave={() => setHover(false)} className="hover-element font-sans text-sm absolute top-full left-0 hidden w-48 bg-white border border-[#D3D3D3] group-hover:flex flex-col transition-all duration-300 z-10">
                            {category.length > 0 && (
                                category.map(cat => (
                                    <div key={cat.id} className="relative group">
                                        <Link
                                            to={`product-category/${cat.category_name}`} 
                                            onClick={() => handleCategory(cat.id, cat.category_name)} 
                                            className="category px-4 py-2 hover:text-primary ml-[5px] flex items-center justify-between"
                                        >
                                            {cat.category_name}
                                            {groupedBrands[cat.id] && groupedBrands[cat.id].length > 0 && <GoChevronRight className="duc text-gray-400" />}
                                        </Link>
                                        <div className={`hidden-element absolute -top-[1px] left-full hidden w-48 bg-white ${groupedBrands[cat.id]?.length > 0 ? 'border border-[#d3d3d3]' : 'border-none'} flex-col transition-all duration-300`}>
                                            {groupedBrands[cat.id] && groupedBrands[cat.id].length > 0 && (
                                                groupedBrands[cat.id].map((brand) => (
                                                    <div key={brand.brand_id}>
                                                        <Link
                                                            to={`product-category/brand/${brand.brand_name}`} 
                                                            onClick={() => {
                                                                handleBrand(brand.brand_id, brand.brand_name, cat.category_name, cat.id);
                                                            }} 
                                                            className="block px-4 py-2 hover:text-primary ml-[5px]"
                                                        >
                                                            {brand.brand_name} 
                                                        </Link>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Menu */}
                    <div className="space-x-6 py-3 hidden lg:flex" data-aos="zoom-in">
                        {Menu.map((item) => (
                            <Link
                                key={item.id}
                                to={item.Link}
                                className={`${activeMenu === item.id ? "text-red-500 font-bold" : "text-gray-700"} `}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Hotline */}
                    <div className="flex items-center space-x-2 text-gray-700 py-3">
                        <FiPhone className="text-lg" />
                        <span>Hotline:</span>
                        <strong className="text-black">(+84) 038-641-3805</strong>
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white p-4 lg:hidden border border-b-2 ">
                <div className="grid grid-cols-4">
                    <a href="/">
                        <div className="flex flex-col items-center justify-center">
                            <IoHomeOutline className="h-5 w-5" />
                            <span className="text-[12px]">Trang chủ</span>
                        </div>
                    </a>
                    <div className="flex flex-col items-center justify-center" onClick={toggleResponsiveMenu}>
                        <RiMenuFill className="h-5 w-5" />
                        <span className="text-[12px]">Danh mục</span>
                    </div>
                    <a href="/product">
                        <div className="flex flex-col items-center justify-center">
                            <RiProductHuntLine className="h-5 w-5" />
                            <span className="text-[12px]">Sản phẩm</span>
                        </div>
                    </a>
                    <div className="flex flex-col items-center justify-center">
                        <FaRegUser className="h-5 w-5" />
                            {
                                user ? (
                                    <span className="text-[12px]" onClick={toggleSideBar}>
                                        {user.name.split(' ').slice(-2).join(' ')}
                                    </span>
                                ) : (
                                    <span className="text-[12px]">
                                        <a href="/login">
                                            Đăng nhập
                                        </a>
                                    </span>
                                )
                            }
                    </div>
                </div>
            </div>
            <ResponsiveSideBar isOpenS={isOpenS} setIsOpenS={setIsOpenS} />
            <Responsive isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}
export default Header