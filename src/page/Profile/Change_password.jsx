import { useEffect, useState } from "react";

function Change_password({ setCurrentTitle }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    useEffect(() => {
        setCurrentTitle('Đổi mật khẩu tài khoản');
    }, [setCurrentTitle]);

    return (
        <div className="p-">
            <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu tài khoản</h2>
            <form className="space-y-6">
                {/* Mật khẩu hiện tại */}
                <div>
                    <strong>
                        Nhập mật khẩu hiện tại
                    </strong>
                    <div className="relative ml-3">
                        <input
                            id="current-password"
                            name="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => handleInputChange(e, setCurrentPassword)}
                            required
                            className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-red-500 focus:outline-none"
                        />
                        <label
                            htmlFor="current-password"
                            className="absolute left-0 top-7 text-gray-500 text-sm transition-all duration-[400ms] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-500 peer-valid:top-1 peer-valid:text-sm peer-valid:text-red-500"
                        >
                            {currentPassword ? "Mật khẩu hiện tại" : "Nhập mật khẩu hiện tại của bạn"}
                        </label>
                    </div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                    <strong>
                        Tạo mật khẩu mới
                    </strong>
                    <div className="relative ml-3">
                        <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => handleInputChange(e, setNewPassword)}
                            required
                            className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-red-500 focus:outline-none"
                        />
                        <label
                            htmlFor="new-password"
                            className="absolute left-0 top-7 text-gray-500 text-sm transition-all duration-[400ms] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-500 peer-valid:top-1 peer-valid:text-sm peer-valid:text-red-500"
                        >
                            {newPassword ? "Mật khẩu mới của bạn" : "Nhập mật khẩu mới của bạn"}
                        </label>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="relative ml-3">
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => handleInputChange(e, setConfirmPassword)}
                            required
                            className="peer block w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-red-500 focus:outline-none"
                        />
                        <label
                            htmlFor="confirm-password"
                            className="absolute left-0 top-7 text-gray-500 text-sm transition-all duration-[400ms] peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-500 peer-valid:top-1 peer-valid:text-sm peer-valid:text-red-500"
                        >
                            {confirmPassword ? "Xác nhận mật khẩu" : "Nhập lại mật khẩu"}
                        </label>
                    </div>
                </div>

                {/* Nút xác nhận */}
                <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-md"
                >
                    Xác nhận
                </button>
            </form>
        </div>
    );
}

export default Change_password;
