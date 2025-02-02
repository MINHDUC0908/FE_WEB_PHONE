import { motion, AnimatePresence } from 'framer-motion';
import { MdAccountCircle, MdLockOutline } from 'react-icons/md';
import { TbTruckDelivery } from 'react-icons/tb';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLogout } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { UseDataUser } from '../../../Context/UserContext';

function ResponsiveSideBar({ isOpenS, setIsOpenS }) {
    const { logout } = UseDataUser();
    const [modal, setModel] = useState(false);
    const navigate = useNavigate();

    const profileLink = [
        {
            id: 1,
            path: '/profiles/Delivery-history',
            name: 'Lịch sử mua hàng',
            icon: <TbTruckDelivery className="text-xl" />
        },
        {
            id: 2,
            path: '/profiles/Your-account',
            name: 'Tài khoản của bạn',
            icon: <MdAccountCircle className="text-xl" />
        },
        {
            id: 3,
            path: '/profiles/Change-password',
            name: 'Đổi mật khẩu',
            icon: <MdLockOutline className="text-xl" />
        }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            sessionStorage.removeItem('newMessageCount');
            toast.success('Đăng xuất thành công');
            navigate("/"); // Điều hướng về trang chủ
        } catch (error) {
            console.error("Đăng xuất thất bại:", error); // Ghi log lỗi nếu cần
        }
    };

    const confirmCancel = () => {
        if (modal) {
            handleLogout(); // Chỉ gọi khi modal đang mở
            setModel(false); // Đóng modal sau khi xử lý
        }
    };

    const ShowModal = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-end mb-[73px] justify-center">
                <div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="relative bg-white w-full max-w-sm rounded-sm" style={{ animation: 'fadeIn 0.5s forwards' }}>
                    <div className="rounded-lg w-96 p-6">
                        <div className="flex items-center justify-center text-[22px] text-[#fd2424]">
                            Thoát tài khoản
                        </div>
                        <hr className="m-2" />
                        <p className="text-center text-[16px] text-[#4a4a4a] font-sans mb-4">
                            Bạn muốn thoát tài khoản?
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 text-black w-[160px] py-2 rounded-lg font-medium hover:bg-gray-400"
                                onClick={() => setModel(false)}
                            >
                                Không
                            </button>
                            <button
                                className="bg-red-600 text-white w-[160px] py-2 rounded-lg font-medium hover:bg-red-700"
                                onClick={() => {confirmCancel(); setIsOpenS(false)}}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence mode="wait">
            {isOpenS && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20"
                        onClick={() => setIsOpenS(false)}
                    ></motion.div>
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-0 left-0 h-full bg-gray-50 w-64 shadow-lg z-20"
                    >
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold">Tài khoản</h2>
                            <button
                                onClick={() => setIsOpenS(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mt-4">
                            {profileLink.map((item) => (
                                <a
                                    href={item.path}
                                    key={item.id}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-100 transition-all"
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium text-gray-700">
                                        {item.name}
                                    </span>
                                </a>
                            ))}
                            <button
                                className="flex items-center gap-4 p-3"
                                onClick={() => {setModel(true)}}
                            >
                                <CiLogout />
                                Thoát tài khoản
                            </button>
                        </div>
                        {modal && <ShowModal />}
                    </motion.div>
                </>
            )}
        </AnimatePresence>

    );
}

export default ResponsiveSideBar;
