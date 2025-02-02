import React from 'react';
import { GoRocket } from "react-icons/go";
import { IoSyncOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";
import { SlBubbles } from "react-icons/sl";

const topbars = [
    {
        id: 1,
        title: 'Giao hàng miễn phí',
        description: 'Cho đơn hàng trên 5,000,000₫',
        data: 200,
        icon: <GoRocket className="h-10 w-10 text-yellow-500"/>
    },
    {
        id: 2,
        title: 'Hoàn trả 90 ngày',
        description: 'Nếu sản phẩm có vấn đề',
        data: 300,
        icon: <IoSyncOutline className="h-10 w-10 text-yellow-500"/>
    },
    {
        id: 3,
        title: 'Thanh toán an toàn',
        description: '100% thanh toán an toàn',
        data: 400,
        icon: <CiCreditCard1 className="h-10 w-10 text-yellow-500"/>
    },
    {
        id: 4,
        title: 'Hỗ trợ 24/7',
        description: 'Hỗ trợ chuyên dụng',
        data: 500,
        icon: <SlBubbles className="h-10 w-10 text-yellow-500"/>
    },
]

function TopBar() {
    return (
        <div className="py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"> 
                {
                    topbars.map((topbar) => {
                        return (
                            <div key={topbar.id} data-aos="fade-up" data-aos-delay={topbar.data} className="flex items-center gap-4 bg-white rounded-lg shadow-md p-6">
                                <div>
                                    {topbar.icon} 
                                </div>
                                <div>
                                    <div className="font-semibold font-serif">
                                        {topbar.title}
                                    </div>
                                    <div className="text-[12px]">
                                        {topbar.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default TopBar;