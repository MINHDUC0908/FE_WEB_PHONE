import { useState, useEffect } from "react";
import axios from "axios";
import { api, src } from "../../../Api";
import { ModalSuccess } from "./ModelSuccess";
import { LazyLoadImage } from "react-lazy-load-image-component";

function UploadAvatar({ user, setUser }) {
    const [previewImage, setPreviewImage] = useState("");
    const [modal, setModal] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Cập nhật ảnh xem trước khi `user.image` thay đổi
    useEffect(() => {
        if (user?.image) {
            const imageUrl = user.image.includes("http") 
                ? user.image 
                : `${src}imgCustomer/${user.image}`;
            setPreviewImage(`${imageUrl}?t=${Date.now()}`);
        }
    }, [user?.image]);

    // Xử lý khi chọn ảnh mới
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Hiển thị ảnh tạm thời khi tải lên
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

            if (res.data.status === "success") {
                setModal(true);
                const newImageUrl = res.data.image.includes("http") 
                    ? res.data.image 
                    : `${src}imgCustomer/${res.data.image}`;

                setPreviewImage(`${newImageUrl}?t=${Date.now()}`);
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
                    <LazyLoadImage
                        src={previewImage}
                        alt="User Avatar"
                        className={`h-32 w-32 rounded-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setLoaded(true)}
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                        
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
