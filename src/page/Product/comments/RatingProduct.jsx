import axios from "axios";
import { useState } from "react";
import { FaCamera, FaFolderOpen, FaHeart, FaPaperPlane, FaRegSmile, FaStar, FaThumbsUp, FaTimes } from "react-icons/fa";
import { api, base64ToFile } from "../../../Api";
import { toast } from "react-toastify";
import { UseDataUser } from "../../../Context/UserContext";
import Camera from "./Camera";
import ModalRating from "./ModalRating";

function ModalStoreReview({ product, setProduct, setModal }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const token = localStorage.getItem("token");
    const [modalOpen, setModalOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [comment, setComment] = useState("");
    const [originalFile, setOriginalFile] = useState(null);
    const { user } = UseDataUser();
    const customer_id = user?.id;
    console.log("Customer ID:", customer_id);
    const hanldeRating = async () => {
        if (!token) {
            toast.error("Vui lòng đăng nhập để đánh giá");
            return;
        }
        console.log("Captured Image:", capturedImage);
        console.log("Type of Captured Image:", typeof capturedImage);
        console.log("Is File:", capturedImage instanceof File);
    
        if (rating === 0) {
            toast.warning("Vui lòng chọn số sao đánh giá");
            return;
        }
        const formData = new FormData();
        let imageFile = originalFile || capturedImage;  // Ưu tiên file gốc nếu có
        
        // Kiểm tra nếu `capturedImage` là chuỗi base64 thì chuyển thành `File`
        if (typeof capturedImage === "string" && capturedImage.startsWith("data:image")) {
            imageFile = base64ToFile(capturedImage, "review_image.png");
        }
        
        // Nếu `capturedImage` là URL blob, sử dụng file gốc (originalFile)
        if (imageFile instanceof File) {
            formData.append("image", imageFile);
        }
        formData.append("image", imageFile);
        formData.append("rating", rating);
        formData.append("product_id", product.id);
        formData.append("comment", comment);
    
        try {
            const res = await axios.post(api + "storeReview", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (res.data.status == "success") {
                setModal(false);
                setProduct((prev) => ({
                    ...prev,
                    ratings: [...prev.ratings, { rating, customer_id}],
                }));
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Có lỗi xảy ra");
            } else {
                toast.error("Không thể kết nối đến server");
            }
        }
    };
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm">
            <div
                className="absolute inset-0 transition-opacity"
                onClick={() => setModal(false)}
            ></div>

            <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 text-center transform transition-all h-[100vh -200px]">
                <div className="absolute -top-3 -right-3">
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                        onClick={() => setModal(false)}
                    >
                        <FaTimes className="text-sm" />
                    </button>
                </div>

                <div className="flex items-center justify-center mb-6">
                    <div className="bg-red-50 p-3 rounded-full">
                        <FaHeart className="text-red-500 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 ml-3">
                        Đánh giá sản phẩm
                    </h2>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-3">Bạn thấy sản phẩm này như thế nào?</p>
                    <div className="flex justify-center items-center mb-2 gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                                    (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                                }`}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        {rating === 1 && "Không hài lòng"}
                        {rating === 2 && "Tạm được"}
                        {rating === 3 && "Bình thường"}
                        {rating === 4 && "Hài lòng"}
                        {rating === 5 && "Tuyệt vời"}
                    </p>
                </div>

                <div className="mb-6">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        rows="3"
                    ></textarea>
                </div>

                <div className="flex justify-center gap-6 mb-6 text-sm">
                    <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
                        <div className="bg-blue-100 p-2 rounded-full mb-2">
                            <FaFolderOpen className="text-blue-500" />
                        </div>
                        <label htmlFor="imageUpload" className="cursor-pointer text-gray-700">
                            Chọn ảnh
                        </label>

                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (!file.type.startsWith("image/")) {
                                    toast.error("Vui lòng chọn file ảnh hợp lệ!");
                                    return;
                                }
                                // Tạo Object URL để hiển thị ảnh xem trước
                                const objectURL = URL.createObjectURL(file);
                                setCapturedImage(objectURL);
                                // Nếu cần gửi file gốc (không phải base64) lên server
                                setOriginalFile(file);
                            }}
                        />
                    </div>
                    <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
                        <div className="bg-green-100 p-2 rounded-full mb-2">
                            <FaRegSmile className="text-green-500" />
                        </div>
                        <span className="text-gray-700">Chất lượng</span>
                    </div>
                    <div className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
                        <div className="bg-purple-100 p-2 rounded-full mb-2">
                            <FaCamera className="text-purple-500" />
                        </div>
                        <button 
                            onClick={() => setModalOpen(true)}
                            className="text-gray-700"
                        >
                            Thêm ảnh
                        </button>
                    </div>
                </div>

                {capturedImage && (
                    <div className="mb-6 bg-gray-50 p-3 rounded-lg h-full ">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Ảnh đã chụp:</h3>
                            <button 
                                className="text-red-500 hover:text-red-600 text-sm"
                                onClick={() => setCapturedImage(null)}
                            >
                                Xóa
                            </button>
                        </div>
                        <div className="h-[200px] overflow-y-auto">
                            <img 
                                src={capturedImage}
                                alt="Ảnh đánh giá" 
                                className="w-full h-full object-cover rounded-lg shadow-sm" 
                            />
                        </div>
                    </div>
                )}

                <button
                    onClick={hanldeRating}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <FaPaperPlane />
                    Gửi đánh giá
                </button>
            </div>

            <Camera
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCapture={(image) => {
                    setCapturedImage(image);
                    setModalOpen(false);
                }}
            />
        </div>
    );
}

function RatingProduct({ product, setProduct}) {
    const totalRatings = product.ratings.length; // Tổng số đánh giá
    const ratingCounts = {
        5: product.ratings.filter((r) => r.rating === 5).length,
        4: product.ratings.filter((r) => r.rating === 4).length,
        3: product.ratings.filter((r) => r.rating === 3).length,
        2: product.ratings.filter((r) => r.rating === 2).length,
        1: product.ratings.filter((r) => r.rating === 1).length,
    };
    const [modal, setModal] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const { user } = UseDataUser();

    const userHasReview = product.ratings.some(rating => rating.customer_id == user?.id)
    return (
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
            {/* Hiển thị đánh giá trung bình */}
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
                Đánh giá sản phẩm
            </h2>
            <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFullStar = product.ratings_avg_rating >= star;
                    const isHalfStar =
                        product.ratings_avg_rating >= star - 0.5 &&
                        product.ratings_avg_rating < star;

                    return (
                        <svg
                            key={star}
                            className="w-6 h-6"
                            viewBox="0 0 20 20"
                            fill={isFullStar ? "#facc15" : isHalfStar ? "#fde68a" : "#d1d5db"}
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                    );
                })}
            </div>
            <p className="text-center text-gray-600 text-sm">
                {totalRatings > 0 ? `${totalRatings} đánh giá` : "Chưa có đánh giá"}
            </p>

            {/* Biểu đồ số lượng đánh giá theo sao */}
            <div className="mt-4">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingCounts[star] || 0;
                    const percentage = totalRatings ? (count / totalRatings) * 100 : 0;

                    return (
                        <div key={star} className="flex items-center mb-2">
                            <span className="text-gray-700 text-sm w-4">{star}</span>
                            <svg className="w-5 h-5 mx-2" viewBox="0 0 20 20" fill="#facc15">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <div className="w-full h-2 bg-gray-200 rounded-md relative">
                                <div
                                    className="h-2 bg-red-600 rounded-md"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <span className="ml-3 text-sm text-gray-600">
                                {count} đánh giá
                            </span>     
                        </div>
                    );
                })}
            </div>
            {
                !userHasReview ? (
                    <div className="text-center">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto shadow-md"
                                onClick={() => setModal(true)}
                            >
                            <FaStar className="text-white" /> Đánh giá
                        </button>
                    </div>
                ) : (
                    <div>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto shadow-md"
                                onClick={() => setShowRating(true)}
                            >
                            <FaStar className="text-white" /> Xem đánh giá
                        </button>
                    </div>
                )
            }
            {modal && <ModalStoreReview product={product} setProduct={setProduct} setModal={setModal} />}
            {showRating && <ModalRating product={product} setShowRating={setShowRating} />}
        </div>
    );
}

export default RatingProduct;
