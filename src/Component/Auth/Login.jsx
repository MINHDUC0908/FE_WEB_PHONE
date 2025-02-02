import { IoIosLock } from "react-icons/io"
import banner_login from "../../assets/banner-login.png"
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa"
import { useEffect, useState } from "react"
import axios from "axios";
import { api } from "../../Api";
import { toast } from "react-toastify";
import { UseDataUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

function Login({setCurrentTitle})
{
    useEffect(() => {
        setCurrentTitle("LOGIN")
    }, [setCurrentTitle])
    const navigate = useNavigate();
    const { setUser } = UseDataUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const login = async () => {
        try {
            const loginRes = await axios.post(api + "login", {
                email,
                password
            });            
            const {token} = loginRes.data;
            console.log(email + password)
            localStorage.setItem("token", token);
            const userRes = await axios.get(api + 'user-profile/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(userRes.data)
            toast.success("Đăng nhập thành công");
            navigate("/");
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
                setPassword("");
            } else {
                setErrorMessage('Vui lòng nhập thông tin.');
            }
        } finally {

        }
    }
    if (localStorage.getItem("token"))
    {
        navigate("/");
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-8  border border-gray-5 mt-5 rounded-lg">
                <div className="text-center">
                    <div className="relative flex justify-center mb-6">
                        <img 
                            src={banner_login} 
                            alt="Online Quiz Banner" 
                            className="w-full max-w-3xl object-cover"  
                        />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                            <IoIosLock className="text-[#FF6347]" size={42} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#FF6347] mb-2 uppercase">Khám Phá Thế Giới Smartphone Hiện Đại</h2>
                    <p className="text-gray-600">Khám phá điện thoại phù hợp với bạn ngay hôm nay!</p>
                </div>
                <div className="mt-8 p-8">
                    <h3 className="text-xl font-medium text-center mb-6">Đăng Nhập Để Mua Sắm</h3>
                    {errorMessage && (
                        <div className="p-4 bg-red-100 text-red-500 rounded-md text-center mb-4">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={(e) => {e.preventDefault();login();}} method="POST" className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
                            <input
                                value={email}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Email hoặc số điện thoại"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                            <input
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label className="ml-2 block text-sm text-gray-700">Hiện mật khẩu</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#FF6347] px-4 py-2 text-white hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-offset-2"
                            >
                            Đăng nhập
                        </button>
                    </form>

                    <div className="mt-6">
                    <p className="text-center text-sm text-gray-600">Hoặc đăng nhập qua</p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                            <FaGoogle className="text-red-400"/>
                            <span className="ml-2">Google</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                            <FaFacebookF className="text-blue-400"/>
                            <span className="ml-2">Zalo</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                            <FaGithub className="text-gray-400"/>
                            <span className="ml-2">Github</span>
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm">
                        <span className="text-gray-600">Bạn chưa có tài khoản? </span>
                        <a href="/register" className="font-medium text-[#FF6347] hover:text-[#FF4500]">
                            Đăng ký
                        </a>
                    </div>
                        <a href="#" className="text-sm font-medium text-[#FF6347] hover:text-[#FF4500]">
                            Quên mật khẩu?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login