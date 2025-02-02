import { FaFacebookF } from "react-icons/fa";
import { FaGooglePlusG } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

function Footer()
{
    return (
        <div className="mb-28 lg:mb-0">
            <hr />
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10 space-x-0 lg:space-x-20">
                    <div className="">
                        <h4 className='text-black font-semibold mb-6'>
                            KẾT NỐI VỚI DUCCOMPUTER SHOP
                        </h4>
                        <div className="space-y-2">
                            <p className="text-gray-600 font-serif">
                                Gọi hỗ trợ 24/7
                            </p>
                            <h3 className="text-blue-500 font-sans font-black text-2xl hover:text-primary cursor-pointer">
                                (+84)386413805
                            </h3>
                            <p className="text-gray-600 font-serif">
                                Thôn Hòa Lâm, Duy Trung, Duy Xuyên, Quảng Nam
                            </p>
                            <p className="text-blue-400 font-serif cursor-pointer">
                                ducle090891999@gmail.com
                            </p>
                        </div>
                        <div className="mt-10 mr-24">
                            <ul className="flex">
                                <li className="mr-4">
                                    <a href="">
                                        <FaFacebookF size={20} className="text-blue-500"/>
                                    </a>
                                </li>
                                <li className="mr-4">
                                    <a href="">
                                        <FaGooglePlusG size={20} className="text-red-500"/>
                                    </a>
                                </li>
                                <li className="mr-4">
                                    <a href="">
                                        <FaYoutube size={20} className="text-red-500"/>
                                    </a>
                                </li>
                                <li className="mr-4">
                                    <a href="">
                                        <FaInstagram size={20} className="text-red-700"/>
                                    </a>
                                </li>
                                <li className="mr-4">
                                    <a href="">
                                        <FaTiktok size={20}/>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0 md:pl-20 lg:pl-0">
                        <h4 className='text-black font-semibold mb-6'>
                            CHÍNH SÁCH
                        </h4>
                        <div>
                            <ul>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Policy
                                    </a>
                                </li>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        FAQs
                                    </a>
                                </li>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Term & Conditions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        <h4 className='text-black font-semibold mb-6'>
                            DANH MỤC
                        </h4>
                        <div>
                            <ul>
                                <li className="py-[3px] relative">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Trang chủ
                                    </a>
                                </li>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Sản phẩm
                                    </a>
                                </li >
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Tin tức
                                    </a>
                                </li>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Liên hệ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0 md:pl-20 lg:pl-0">
                        <h4 className='text-black font-semibold mb-6'>
                            LIÊN KẾT
                        </h4>
                        <div>
                            <ul>
                                <li className="py-[3px] relative">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Policy
                                    </a>
                                </li>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Term & Conditions
                                    </a>
                                </li >
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        FAQs
                                    </a>
                                </li>
                                <li className="py-[3px]">
                                    <a href="" className="text-[16px] font-sans text-[#666666] hover:text-black">
                                        Order Tracking
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10">
                <hr />
                <div className="my-10 space-y-3">
                    <div className="block lg:flex items-center">
                        <h4 className="text-black font-semibold inline-block mr-4">
                            Điện thoại:
                        </h4>
                        <div>
                            <ul className="font-sans text-[14px] text-[#666666] flex flex-wrap">
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Apple
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    BlackBerry
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Motorola
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Samsung
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Linh kiện máy tính
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Máy tính văn phòng
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    PlayStation
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Flash Sale
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Điện thoại
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                    Laptop
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:flex items-center">
                        <h4 className="text-black font-semibold inline-block mr-4">
                            Laptop:
                        </h4>
                        <div>
                            <ul className="font-sans text-[14px] text-[#666666] flex flex-wrap">
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Laptop Asus
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Laptop Dell
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Laptop HP
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Macbook
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Ipad
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Laptop Asus
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tai nghe
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Bàn phím
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Samsung
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Nintendo Switch
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:flex items-center">
                        <h4 className="text-black font-semibold inline-block mr-4">
                            Tablet:
                        </h4>
                        <div>
                            <ul className="font-sans text-[14px] text-[#666666] flex flex-wrap">
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Beneve
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Cutepad
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Ipad
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Samsung
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Ipad
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Motorola
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                BlackBerry
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Beneve
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Samsung
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Samsung
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:flex items-center">
                        <h4 className="text-black font-semibold inline-block mr-4">
                            Phụ kiện:
                        </h4>
                        <div>
                            <ul className="font-sans text-[14px] text-[#666666] flex flex-wrap">
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Bàn phím
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Bao da – Ốp lưng – Dán màn hình
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Loa
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Máy nghe nhạc
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Motorola
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                BlackBerry
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Samsung
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                                <li className="relative inline-flex items-center pr-[10px] mr-[10px]">
                                Tablet Beneve
                                    <span className="absolute right-[-3px] top-1/2 transform -translate-y-1/2 w-[1px] h-[20px] bg-black"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="my-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-20 text-center">
                        <div>
                            <p className="font-sans text-sm lg:text-lg">
                                © Thiết kế và lập trình bởi: <span className="text-primary font-sans font-semibold">LE VAN MINH DUC</span>
                            </p>
                        </div>
                        <div>
                            <p className="font-sans text-sm lg:text-lg">
                                Phương thức thanh toán: Thanh toán khi nhận hàng
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer