import { useState, useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { UseDataUser } from "../../Context/UserContext";

function Your_account({ setCurrentTitle }) {
  const { user } = UseDataUser();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    gender: user?.gender !== null ? user?.gender : "",
    date: user?.date || "",
  });

  // Sử dụng useEffect để cập nhật tiêu đề trang khi component render lần đầu
  useEffect(() => {
    setCurrentTitle("Tài khoản của bạn");
  }, [setCurrentTitle]);

  // Cập nhật lại formData mỗi khi thông tin người dùng thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "", // Đảm bảo không có giá trị null
        gender: user.gender !== null ? user.gender : "", // Đảm bảo gender không bị null
        date: user.date || "", // Đảm bảo date không bị null
      });
    }
  }, [user]);

  // Hàm xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra và xử lý trường gender
    if (formData.gender === "") {
      alert("Vui lòng chọn giới tính");
      return;
    }

    try {
      // Gửi PUT request để cập nhật thông tin người dùng
      const response = await axios.put(
        `http://127.0.0.1:8000/api/customer/update/${user.id}`,
        {
          name: formData.name,
          gender: formData.gender,
          date: formData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Cập nhật thông tin thành công");
      console.log("Cập nhật thành công", response.data);
    } catch (error) {
      console.error(
        "Có lỗi xảy ra khi cập nhật:",
        error.response?.data || error
      );
    }
  };
  console.log(formData);
  if (!user) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="max-w-xl mx-auto p-0 lg:max-w-3xl lg:p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <label className="text-gray-500 text-sm">Họ và tên</label>
            <div className="flex items-center">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-1 border-none focus:outline-none text-gray-900 cursor-pointer"
              />
              <BsPencilSquare className="h-5 w-5 text-gray-400 cursor-pointer" />
            </div>
            <div className="absolute bottom-0 w-full h-px bg-gray-200"></div>
          </div>
          <div className="relative">
            <label className="text-gray-500 text-sm">Email</label>
            <input
              type="email"
              value={user.email}
              className="w-full py-1 border-none focus:outline-none text-gray-900"
              readOnly
            />
            <div className="absolute bottom-0 w-full h-px bg-gray-200"></div>
          </div>
          <div className="relative">
            <label className="text-gray-500 text-sm">Giới tính</label>
            <div className="flex items-center">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full py-1 border-none focus:outline-none text-gray-900 cursor-pointer"
              >
                <option value={1}>Nam</option>
                <option value={0}>Nữ</option>
              </select>
              <BsPencilSquare className="h-5 w-5 text-gray-400 cursor-pointer" />
            </div>
            <div className="absolute bottom-0 w-full h-px bg-gray-200"></div>
          </div>
          <div className="relative">
            <label className="text-gray-500 text-sm">Ngày tháng năm sinh</label>
            <div className="flex items-center">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full py-1 border-none focus:outline-none text-gray-900 cursor-pointer"
              />
              <BsPencilSquare className="h-5 w-5 text-gray-400 cursor-pointer" />
            </div>
            <div className="absolute bottom-0 w-full h-px bg-gray-200"></div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mb-10"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Your_account;
