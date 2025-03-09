import { forgotData } from "../../Context/ForgotPassword";

export const ModalForgot = ({ setModal }) => {
    const { email, handleForgotPassword, setEmail, isLoading } = forgotData();
    const handleClose = () => {
        if (!isLoading) {
            setModal(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            ></div>
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl p-6 text-center animate-slideUp">
                <h2 className="text-xl font-semibold text-gray-800">Quên mật khẩu?</h2>
                <p className="text-sm text-gray-500 mt-2">Nhập email của bạn để đặt lại mật khẩu.</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleForgotPassword();
                    }}
                    className="mt-4 flex flex-col gap-4"
                >
                    <input
                        type="email"
                        placeholder="Nhập email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
                    >
                        {isLoading ? "Đang xử lí..." : "Gửi yêu cầu"}
                    </button>
                </form>
                <button
                    className={`mt-4 text-sm ${
                        isLoading ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700"
                    } transition duration-300`}
                    onClick={handleClose}
                    disabled={isLoading} // Chặn bấm khi đang xử lý
                >
                    Hủy
                </button>
            </div>
        </div>
    );
};
