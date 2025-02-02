import axios from "axios";
import { useEffect, useState } from "react";
import img from "../../assets/ai.png";
import { Link, useLocation } from "react-router-dom";

function ShowNew() {
    const [showNew, setShowNew] = useState(null); 
    const [news, setNews] = useState([]); 
    const [font, setFont] = useState(false);
    const [loading, setLoading] = useState(true); 
    const location = useLocation();
    const id = location.state?.id;

    const fetchShowNew = async (id) => {
        if (!id) {
            console.error("Không tìm thấy id từ location.state");
            setLoading(false);
            return;
        }
        try {
            const result = await axios.get(`https://duc-phone.onrender.com/api/show/${id}`);
            setShowNew(result.data.data || null);
        } catch (error) {
            console.error("Lỗi khi gọi API chi tiết bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNew = async () => {
        try {
            const result = await axios.get(`https://duc-phone.onrender.com/api/new`);
            setNews(result.data.data || []);
        } catch (error) {
            console.error("Lỗi khi gọi API danh sách bài viết:", error);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} ngày trước`;
        } else if (diffInHours > 0) {
            return `${diffInHours} giờ trước`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} phút trước`;
        } else {
            return "Vừa xong";
        }
    };

    useEffect(() => {
        fetchShowNew(id);
        fetchNew();
    }, [id]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative rounded-lg shadow-2xl animate-bounce-in">
                    <div className="flex justify-center mt-4">
                        <div className="w-12 h-12 border-4 border-t-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!showNew) {
        return <div className="text-center text-red-500">Không tìm thấy bài viết!</div>;
    }

    return (
        <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 my-10">
            <div className="grid grid-cols-2 gap-20">
                <div>
                    <img src={`http://127.0.0.1:8000/imgnew/${showNew.images}`} alt={showNew.title} />
                </div>
                <div>
                    <div className="flex items-center mb-5">
                        <div>
                            <img src={img} alt="Author Avatar" className="rounded-full mb-0" />
                        </div>
                        <div className="relative ml-5">
                            <span className="absolute top-1/2 -left-3 w-2 h-2 bg-gray-400 rounded-full transform -translate-y-1/2"></span>
                            <span className="text-center">
                                {showNew.created_at ? formatTimeAgo(showNew.created_at) : ""}
                            </span>
                        </div>
                    </div>
                    <h1 className={`${font ? "text-5xl" : "text-4xl"} font-semibold font-sans`}>
                        {showNew.title}
                    </h1>
                    <hr className="mt-10" />
                </div>
            </div>
            <div className="grid grid-cols-12 gap-8 mt-10">
                <div className="col-span-3">
                    <div className="sticky top-4">
                        <div className="flex items-center justify-center rounded-lg overflow-hidden border border-gray-300 shadow-md">
                            <button
                                onClick={() => setFont(false)}
                                className={`px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                                    !font
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                Cỡ chữ nhỏ
                            </button>
                            <button
                                onClick={() => setFont(true)}
                                className={`px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                                    font
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                Cỡ chữ lớn
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-span-6">
                    <div
                        className={`${font ? "text-xl" : "text-md"} prose max-w-none text-gray-600`}
                        dangerouslySetInnerHTML={{ __html: showNew.outstanding }}
                    />
                </div>
                <div className="col-span-3">
                    <div className="sticky top-4 border border-gray-200 rounded-lg">
                        <p className="text-center py-2 bg-gray-200 rounded-lg font-sans font-semibold">
                            Bài viết mới nhất
                        </p>
                        {news.map((item) => (
                            <Link to={`/new/${item.title}`} key={item.id} state={{ id: item.id }}>
                                <div className="grid grid-cols-4 gap-4 p-4">
                                    <div className="flex justify-center items-center">
                                        <img
                                            src={`http://127.0.0.1:8000/imgnew/${item.images}`}
                                            alt={item.title}
                                            className="rounded-lg w-full h-auto"
                                        />
                                    </div>
                                    <div className="col-span-3 flex flex-col justify-between">
                                        <p className="text-xs font-semibold mb-2">{item.title}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.created_at ? formatTimeAgo(item.created_at) : ""}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowNew;
