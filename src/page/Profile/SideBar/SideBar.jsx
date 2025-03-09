import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle, MdLockOutline } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { useState, useEffect } from "react";
import { CiLogout } from "react-icons/ci";
import { toast } from "react-toastify";
import { UseDataUser } from "../../../Context/UserContext";

function SideBar() {
    const [id, setId] = useState(() => parseInt(localStorage.getItem("selectedTab")) || 1);
    const { logout } = UseDataUser(); 
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

    const profileLink = [
        { id: 1, path: '/profiles/Delivery-history', name: 'Lịch sử mua hàng', icon: <TbTruckDelivery /> },
        { id: 2, path: '/profiles/Your-account', name: 'Tài khoản của bạn', icon: <MdAccountCircle /> },
        { id: 3, path: '/profiles/Change-password', name: 'Đổi mật khẩu', icon: <MdLockOutline /> }
    ];

    useEffect(() => {
        const currentPath = window.location.pathname;
        const currentTab = profileLink.find(item => item.path === currentPath);
        if (currentTab) {
            setId(currentTab.id);
        }
    }, []);

    const handleClick = (id) => {
        setId(id);
        localStorage.setItem("selectedTab", id);
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Đăng xuất thành công');
            sessionStorage.removeItem('newMessageCount');
            navigate("/");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 hidden lg:block">
            <div className="space-y-2">
                {profileLink.map(item => (
                    <Link key={item.id} 
                        to={item.path} 
                        onClick={() => handleClick(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            id === item.id 
                            ? "bg-red-500 text-white font-semibold" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t">
                <button 
                    className="w-full flex items-center gap-3 text-gray-600 hover:text-red-500 transition-all"
                    onClick={() => setModal(true)}
                >
                    <CiLogout size={20} />
                    Thoát tài khoản
                </button>
            </div>

            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[420px] transform scale-95 transition-all duration-300 ease-out">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <svg
                                    className="w-12 h-12 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Bạn có chắc chắn muốn đăng xuất?
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Hành động này sẽ đưa bạn ra khỏi tài khoản. Bạn có thể đăng nhập lại bất cứ lúc nào.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="w-40 px-5 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition font-medium"
                                onClick={() => setModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="w-40 px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium flex items-center justify-center space-x-2"
                                onClick={handleLogout}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5m0 14a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SideBar;
