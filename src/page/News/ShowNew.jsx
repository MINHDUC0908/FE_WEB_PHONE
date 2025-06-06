import axios from "axios";
import { useEffect, useState } from "react";
import img from "../../assets/ai.png";
import { Link, useLocation } from "react-router-dom";
import { api, formatTimeAgo, src } from "../../Api";
import { FaShoppingBag } from "react-icons/fa";

function ShowNew() {
    const [showNew, setShowNew] = useState(null);
    const [news, setNews] = useState([]);
    const [loadingShowNew, setLoadingShowNew] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);
    const [font, setFont] = useState(false);

    const location = useLocation();
    const id = location.state?.id;

    useEffect(() => {
        window.scrollTo(0, 0);

        if (!id) {
            console.error("Không tìm thấy id từ location.state");
            setLoadingShowNew(false);
            return;
        }

        const fetchShowNew = async () => {
            try {
                setLoadingShowNew(true);
                const result = await axios.get(api + `show/${id}`);
                setShowNew(result.data.data || null);
            } catch (error) {
                console.error("Lỗi khi gọi API chi tiết bài viết:", error);
            } finally {
                setLoadingShowNew(false);
            }
        };

        setTimeout(() => {
            fetchShowNew();
        }, 500)
    }, [id]);

    useEffect(() => {
        const fetchNew = async () => {
            try {
                setLoadingNews(true);
                const result = await axios.get(api + `new`);
                setNews(result.data.data || []);
            } catch (error) {
                console.error("Lỗi khi gọi API danh sách bài viết:", error);
            } finally {
                setLoadingNews(false);
            }
        };

        setTimeout(() => {
            fetchNew();
        }, 500)
    }, []);

    if (loadingShowNew) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in"></div>
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <FaShoppingBag className="text-blue-500 text-lg" />
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
                    <img src={src + `imgnew/${showNew.images}`} alt={showNew.title} />
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
                                            src={src + `imgnew/${item.images}`}
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
