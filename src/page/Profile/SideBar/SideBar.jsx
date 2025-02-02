import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { toast } from "react-toastify";
import { UseDataUser } from "../../../Context/UserContext";
import { MdLockOutline } from "react-icons/md";

function SideBar() {
    const [id, setId] = useState(1);
    const { logout } = UseDataUser(); 
    const [modal, setModel] = useState(false);
    const navigate = useNavigate();
    const profileLink = [
        {
            id: 1,
            path: '/profiles/Delivery-history',
            name: 'Lịch sử mua hàng',
            icon: <TbTruckDelivery />
        },
        {
            id: 2,
            path: '/profiles/Your-account',
            name: 'Tài khoản của bạn',
            icon: <MdAccountCircle />
        },
        {
            id: 3,
            path: '/profiles/Change-password',
            name: 'Đổi mật khẩu',
            icon: <MdLockOutline/>
        }
    ];
    const handleClick = (id) => {
        setId(id);
    }
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Đăng xuất thành công');
            sessionStorage.removeItem('newMessageCount');
            navigate("/");
        } catch (error) {
            
        }
    }
    const confirmCancel = () => {
        if (modal) {
            handleLogout();
        }
    };
    const ShowModal = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="relative bg-white w-full max-w-sm rounded-sm" style={{ animation: 'fadeIn 0.5s forwards' }}>
                    <div className="rounded-lg w-96 p-6">
                        <h3 className="text-center text-lg font-semibold mb-4">
                            Bạn muốn thoát tài khoản?
                        </h3>
                        <div className="flex justify-between">
                        <button
                            className="bg-gray-300 text-black w-[160px] py-2 rounded-lg font-medium hover:bg-gray-400"
                            onClick={() => setModel(false)}
                        >
                            Không
                        </button>
                        <button
                            className="bg-red-600 text-white w-[160px] py-2 rounded-lg font-medium hover:bg-red-700"
                            onClick={() => confirmCancel()}
                        >
                            Xác nhận
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-gray-100 rounded-lg hidden lg:block">
            <div>
                {profileLink.map(item => (
                    <div key={item.id} className="flex">
                        <Link to={item.path} 
                            key={item.id}
                            onClick={() => handleClick(item.id)}
                            className={`${id === item.id ? "text-red-500 font-semibold border rounded border-red-400 bg-red-100" : "text-gray-700"} flex items-center justify-center gap-2 p-4 w-full`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="p-4 w-full flex items-center justify-center -ml-3">
                <button className="flex items-center gap-2" onClick={() =>setModel(true)}>
                    <CiLogout/>Thoát tài khoản
                </button>
            </div>
            {
                modal && <ShowModal/>
            }
        </div>
    );
}

export default SideBar;
