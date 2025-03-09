import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, KeyIcon, ShieldCheckIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../../Api";

export default function ForgotPassword({ setCurrentTitle }) {
    const [password, setPassword] = useState("");
    const [password_confirmation, setpassword_confirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showpassword_confirmation, setShowpassword_confirmation] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMatched, setPasswordMatched] = useState(true);
    const [loading, setLoading] = useState(false)
    const {token} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        setCurrentTitle("Đổi mật khẩu");
    }, [setCurrentTitle]);

    useEffect(() => {
        // Kiểm tra độ mạnh của mật khẩu
        let strength = 0;
        if (password.length > 0) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);

        // Kiểm tra mật khẩu có khớp không
        if (password_confirmation) {
            setPasswordMatched(password === password_confirmation);
        }
    }, [password, password_confirmation]);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Ngăn form reload
        if (password !== password_confirmation) {
            setPasswordMatched(false);
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(api + "reset-password", {
                token: token,
                password: password,
                password_confirmation: password_confirmation
            });
    
            if (res.data.status === "success") {
                toast.success("Cập nhật mật khẩu thành công!");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật mật khẩu!");
        } finally {
            setLoading(false);
        }
    };
    

    const getStrengthColor = () => {
        if (passwordStrength < 2) return "bg-red-500";
        if (passwordStrength < 4) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthText = () => {
        if (passwordStrength < 2) return "Yếu";
        if (passwordStrength < 4) return "Trung bình";
        return "Mạnh";
    };

    return (
        <div className="flex py-10 items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-2/5 flex flex-col items-center md:items-start">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <KeyIcon size={40} className="text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center md:text-left">Đặt lại mật khẩu</h2>
                        <p className="text-gray-500 mb-8 text-center md:text-left">
                            Vui lòng tạo mật khẩu mạnh để bảo vệ tài khoản của bạn một cách an toàn.
                        </p>
                        
                        <div className="hidden md:block bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="font-medium text-blue-800 mb-2">Mật khẩu an toàn nên:</h3>
                            <ul className="text-sm text-blue-700 space-y-2">
                                <li className="flex items-start">
                                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 text-blue-500" />
                                    Có ít nhất 8 ký tự
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 text-blue-500" />
                                    Kết hợp chữ hoa, chữ thường
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 text-blue-500" />
                                    Bao gồm số và ký tự đặc biệt
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon size={16} className="mr-2 mt-0.5 text-blue-500" />
                                    Không trùng với mật khẩu cũ
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phần form bên phải */}
                    <div className="w-full md:w-3/5 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 mt-6 md:mt-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Mật khẩu mới</label>
                                <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full p-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                                </div>

                                {password && (
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Độ mạnh mật khẩu:</span>
                                                <span className={`text-sm font-medium ${
                                                    passwordStrength < 2 ? "text-red-500" : 
                                                    passwordStrength < 4 ? "text-yellow-500" : "text-green-500"
                                                }`}>
                                                    {getStrengthText()}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <ul className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-1">
                                            <li className={password.length >= 8 ? "text-green-500" : ""}>
                                                <span className="flex items-center">
                                                    {password.length >= 8 ? <CheckCircleIcon size={14} className="mr-1" /> : <AlertCircleIcon size={14} className="mr-1" />}
                                                    Ít nhất 8 ký tự
                                                </span>
                                            </li>
                                            <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                                                <span className="flex items-center">
                                                    {/[A-Z]/.test(password) ? <CheckCircleIcon size={14} className="mr-1" /> : <AlertCircleIcon size={14} className="mr-1" />}
                                                    Có chữ in hoa
                                                </span>
                                            </li>
                                            <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
                                                <span className="flex items-center">
                                                    {/[0-9]/.test(password) ? <CheckCircleIcon size={14} className="mr-1" /> : <AlertCircleIcon size={14} className="mr-1" />}
                                                    Có chữ số
                                                </span>
                                            </li>
                                            <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : ""}>
                                                <span className="flex items-center">
                                                    {/[^A-Za-z0-9]/.test(password) ? <CheckCircleIcon size={14} className="mr-1" /> : <AlertCircleIcon size={14} className="mr-1" />}
                                                    Có ký tự đặc biệt
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {/* Xác nhận mật khẩu */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Xác nhận mật khẩu</label>
                                <div className="relative">
                                <input
                                    type={showpassword_confirmation ? "text" : "password"}
                                    name="confirm-password"
                                    className={`w-full p-4 pr-10 border ${
                                    password_confirmation && !passwordMatched 
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    } rounded-lg focus:outline-none focus:ring-2 transition-all text-base`}
                                    placeholder="Nhập lại mật khẩu"
                                    value={password_confirmation}
                                    onChange={(e) => setpassword_confirmation(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowpassword_confirmation(!showpassword_confirmation)}
                                >
                                    {showpassword_confirmation ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                                </div>
                                {password_confirmation && !passwordMatched && (
                                <p className="mt-2 text-sm text-red-500 flex items-center">
                                    <AlertCircleIcon size={16} className="mr-1" /> Mật khẩu không khớp
                                </p>
                                )}
                                {password_confirmation && passwordMatched && password && (
                                <p className="mt-2 text-sm text-green-500 flex items-center">
                                    <ShieldCheckIcon size={16} className="mr-1" /> Mật khẩu khớp
                                </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium text-base shadow-md"
                            >
                                Đặt lại mật khẩu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}