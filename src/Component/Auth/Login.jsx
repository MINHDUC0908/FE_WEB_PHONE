import { IoIosLock } from "react-icons/io"
import banner_login from "../../assets/banner-login.png"
import { FaFacebookF, FaGithub, FaGoogle, FaSignInAlt } from "react-icons/fa"
import { useEffect, useState } from "react"
import axios from "axios";
import { api } from "../../Api";
import { toast } from "react-toastify";
import { UseDataUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";;
import { ModalForgot } from "./ModalForGot";

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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const loginWithGoogle = async () => {
        try {
            setIsGoogleLoading(true);
            const res = await axios.get(api + "auth/google");
            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                toast.error("Không thể kết nối với Google");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập Google:", error);
            toast.error("Đã xảy ra lỗi khi đăng nhập với Google");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    useEffect(() => {
        // Lấy token từ URL sau khi được chuyển hướng từ callback
        const urlParams = new URLSearchParams(window.location.search);
        const googleToken = urlParams.get("token");
        const errorMsg = urlParams.get("error");
        
        if (googleToken) {
            // Lưu token vào localStorage
            localStorage.setItem("token", googleToken);
            console.log("Token saved:", googleToken);
            
            // Xóa token khỏi URL
            window.history.replaceState(null, "", window.location.pathname);
            
            // Hiển thị thông báo thành công
            toast.success("Đăng nhập thành công!");
            
            // Chuyển hướng người dùng đến trang chính
            navigate("/");
        } else if (errorMsg) {
            toast.error("Đăng nhập thất bại: " + errorMsg);
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, [navigate]);
    const login = async () => {
        try {
            setIsLoading(true);
            const loginRes = await axios.post(api + "login", {
                email,
                password
            });            
            const {token} = loginRes.data;
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
            setIsLoading(false);
        }
    }
    if (localStorage.getItem("token"))
    {
        navigate("/");
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex items-center mt-3">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700 cursor-pointer">
                                    Hiện mật khẩu
                                </label>
                            </div>
                        </div>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#FF6347] px-4 py-2 text-white font-medium hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt className="text-lg" />
                                    <span>Đăng nhập</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                    <p className="text-center text-sm text-gray-600">Hoặc đăng nhập qua</p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <button
                            onClick={loginWithGoogle}
                            disabled={isGoogleLoading}
                            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isGoogleLoading ? (
                                <span>Đang xử lý...</span>
                            ) : (
                                <>
                                    <FaGoogle className="text-red-400"/>
                                    <span className="ml-2">Google</span>
                                </>
                            )}
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
                        <button onClick={() => setModal(true)} className="text-sm font-medium text-[#FF6347] hover:text-[#FF4500]">
                            Quên mật khẩu?
                        </button>
                    </div>
                </div>
            </div>
            {modal && <ModalForgot setModal={setModal}/>}
        </div>
    )
}
export default Login