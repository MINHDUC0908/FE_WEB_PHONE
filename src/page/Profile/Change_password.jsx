import { useEffect, useState } from "react";
import { ModalSuccess } from "./Component/ModelSuccess";
import axios from "axios";
import { api } from "../../Api";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { motion } from 'framer-motion';

function Change_password({ setCurrentTitle }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modal, setModal] = useState(false)
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const token = localStorage.getItem("token");
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    useEffect(() => {
        setCurrentTitle('Đổi mật khẩu tài khoản');
    }, [setCurrentTitle]);
    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(api + "change-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );            
            if (response.data.status === "success")
            {
                setModal(true)
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
         finally {
            setIsLoading(false);
        }
    };
    const togglePasswordVisibility = () => {
        setShowCurrentPassword((prev) => !prev);
    };
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prev) => !prev);
    };
    const toggleConfigPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };
    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu tài khoản</h2>
            <form className="space-y-6" onSubmit={handleChangePassword}>
            <div>
                <strong>Nhập mật khẩu hiện tại</strong>
                <div className="relative ml-3">
                    <input
                        id="current-password"
                        name="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => handleInputChange(e, setCurrentPassword)}
                        className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-red-500 focus:outline-none"
                    />
                    <label
                        htmlFor="current-password"
                        className="absolute left-0 top-7 text-gray-500 text-sm transition-all duration-[400ms] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-500 peer-valid:top-1 peer-valid:text-sm peer-valid:text-red-500"
                    >
                        {currentPassword ? "Mật khẩu hiện tại" : "Nhập mật khẩu hiện tại của bạn"}
                    </label>
                    {/* Nút hiển thị mật khẩu */}
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>
                <div>
                    <strong>
                        Tạo mật khẩu mới
                    </strong>
                    <div className="relative ml-3">
                        <input
                            id="new-password"
                            name="new-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => handleInputChange(e, setNewPassword)}
                            className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-red-500 focus:outline-none"
                        />
                        <label
                            htmlFor="new-password"
                            className="absolute left-0 top-7 text-gray-500 text-sm transition-all duration-[400ms] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-500 peer-valid:top-1 peer-valid:text-sm peer-valid:text-red-500"
                        >
                            {newPassword ? "Mật khẩu mới của bạn" : "Nhập mật khẩu mới của bạn"}
                        </label>
                        <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="relative ml-3">
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => handleInputChange(e, setConfirmPassword)}
                            className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-red-500 focus:outline-none"
                        />
                        <label
                            htmlFor="confirm-password"
                            className="absolute left-0 top-7 text-gray-500 text-sm transition-all duration-[400ms] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-500 peer-valid:top-1 peer-valid:text-sm peer-valid:text-red-500"
                        >
                            {confirmPassword ? "Xác nhận mật khẩu" : "Nhập lại mật khẩu"}
                        </label>
                        <button
                            type="button"
                            onClick={toggleConfigPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-md transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0.6, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
                        >
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span className="text-sm font-medium">Đang xử lý...</span>
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <FaSignInAlt className="text-lg" />
                            <span className="text-sm font-medium">Đổi mật khẩu</span>
                        </div>
                    )}
                </button>
            </form>
            {modal && <ModalSuccess setModal={setModal}/>}
        </div>
    );
}

export default Change_password;
