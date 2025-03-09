import { useState, useEffect } from "react";
import axios from "axios";
import { api, src } from "../../../Api";
import { ModalSuccess } from "./ModelSuccess";

function UploadAvatar({ user, setUser }) {
    const [previewImage, setPreviewImage] = useState(
        user?.image
            ? `${user.image.includes("http") ? user.image : src + "storage/imgCustomer/" + user.image}`
            : ""
    );
    const [modal, setModal] = useState(false);

    // Cập nhật ảnh xem trước khi `user.image` thay đổi
    useEffect(() => {
        if (user?.image) {
            setPreviewImage(
                `${user.image.includes("http") ? user.image : src + "storage/imgCustomer/" + user.image}?t=${Date.now()}`
            );
        }
    }, [user?.image]);

    // Xử lý khi chọn ảnh mới
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const objectURL = URL.createObjectURL(file);
        setPreviewImage(objectURL);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post(`${api}customer/image/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            if (res.data.status == "success")
            {
                setModal(true);
                const imageUrl = res.data.image.includes("http")
                    ? res.data.image
                    : src + "storage/imgCustomer/" + res.data.image;
    
                setPreviewImage(`${imageUrl}?t=${Date.now()}`);
                setUser((prev) => ({ ...prev, image: res.data.image }));
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật ảnh:", error);
        }
    };

    return (
        <div className="flex flex-col items-center text-center">
            <label htmlFor="imageUpload" className="cursor-pointer">
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-700 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </label>
            <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
            <p className="text-gray-500 mt-2 text-sm italic">Nhấp vào để cập nhật ảnh mới 📸</p>
            <p className="text-red-500 text-xs mt-1">Ảnh nên có kích thước nhỏ hơn 5MB (JPG, PNG)</p>

            {modal && <ModalSuccess setModal={setModal} />}
        </div>
    );
}

export default UploadAvatar;
