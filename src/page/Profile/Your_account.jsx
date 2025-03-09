import { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { UseDataUser } from "../../Context/UserContext";
import { api } from "../../Api";
import UploadAvatar from "./Component/UploadAvatar";
import { CiLock } from "react-icons/ci";
import { ModalSuccess } from "./Component/ModelSuccess";


function Your_account({ setCurrentTitle }) {
    const { user, setUser } = UseDataUser();
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        gender: user?.gender !== null ? user?.gender : "",
        date: user?.date || "",
    });

    useEffect(() => {
        setCurrentTitle("Tài khoản của bạn");
    }, [setCurrentTitle]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                gender: user.gender !== null ? user.gender : "",
                date: user.date || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.gender === "") {
            toast.error("Vui lòng chọn giới tính");
            return;
        }

        try {
            const response = await axios.put(
                `${api}customer/update/${user.id}`,
                {
                    name: formData.name,
                    gender: formData.gender,
                    date: formData.date,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.message === "Cập nhật thành công") {
                setUser((prev) => ({ ...prev, ...response.data.data }));
                setModal(true);
            }            
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật:", error.response?.data || error);
            toast.error("Cập nhật thông tin thất bại");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Tài khoản của bạn</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Phần ảnh bên trái - Căn giữa */}
                    <div className="lg:w-1/3 flex justify-center items-center">
                        <div className="w-52 h-52 flex items-center justify-center mb-0 lg:mb-52">
                            <UploadAvatar user={user} setUser={setUser} />
                        </div>
                    </div>

                    {/* Phần thông tin bên phải */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Họ và tên */}
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-300">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full py-2 border-none focus:outline-none text-gray-900 placeholder-gray-400"
                                    placeholder="Nhập họ và tên"
                                />
                                <BsPencilSquare className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-300" />
                            </div>
                        </div>

                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-300">
                                <input
                                    type="text"
                                    name="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="w-full py-2 border-none focus:outline-none text-gray-900 placeholder-gray-400"
                                />
                                <CiLock className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors duration-300" />
                            </div>
                        </div>
                        {/* Giới tính */}
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full py-2 px-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
                            >
                                {formData.gender === "" && <option value="">Chọn giới tính</option>}
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                        {/* Ngày tháng năm sinh */}
                        <div className="">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày tháng năm sinh</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full py-2 px-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
                            />
                        </div>

                        {/* Nút cập nhật thông tin */}
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                            >
                                Cập nhật thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {
                modal && <ModalSuccess setModal={setModal}/>
            }
        </div>
    );
}

export default Your_account;
