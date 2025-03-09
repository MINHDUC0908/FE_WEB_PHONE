import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, src } from "../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";

function New({ setCurrentTitle }) {
    useEffect(() => {
        setCurrentTitle("Tin tức - DUC COMPUTER");
    }, [setCurrentTitle]);

    const [news, setNews] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState({});
    const [page, setPage] = useState(1); // 🔹 Trang hiện tại
    const itemsPerPage = 6; // 🔹 Số tin tức trên mỗi trang

    const fetchNews = async () => {
        try {
            const result = await axios.get(api + "news", {
                headers: { "Cache-Control": "no-cache" },
            });
            if (result?.data) {
                setNews(result.data.data);
                setError("");
            }
        } catch (error) {
            setError("Không thể tải danh sách tin tức. Vui lòng thử lại sau!");
            console.error("Error fetching news:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchNews();
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    // 🔹 Skeleton loading
    const skeletonItems = Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={index} className="animate-pulse bg-white shadow-md rounded-lg overflow-hidden">
            <div className="w-full h-56 bg-gray-300"></div>
            <div className="p-5">
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
        </div>
    ));

    // 🔹 Lấy danh sách tin tức theo trang
    const displayedNews = news.slice(0, page * itemsPerPage);

    return (
        <div className="container mx-auto px-4 xl:px-28 my-10">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-10 uppercase tracking-wider">
                Tin tức mới nhất
            </h2>

            {error ? (
                <p className="text-red-500 text-center text-lg font-semibold">{error}</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading
                            ? skeletonItems
                            : displayedNews.map((item) => (
                                <Link 
                                    to={`/new/${item.title}`} 
                                    key={item.id} 
                                    state={{ id: item.id }} 
                                    className="group block bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
                                >
                                    <div className="relative w-full h-56 overflow-hidden">
                                        <LazyLoadImage
                                            src={`${src}storage/${item.thumbnail}`}
                                            alt=""
                                            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                                                loadedImages[item.id] ? "opacity-0" : "opacity-100"
                                            }`}
                                            loading="lazy"
                                        />
                                        <LazyLoadImage
                                            src={`${src}imgNew/${item.images}`}
                                            alt={item.title}
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${
                                                loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                            }`}
                                            onLoad={() => setLoadedImages((prev) => ({ ...prev, [item.id]: true }))}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: item.outstanding }}
                                        />
                                        <div className="mt-4">
                                            <span className="text-red-500 font-semibold text-sm">Xem chi tiết →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    {/* 🔹 Nút Xem thêm */}
                    {displayedNews.length < news.length && (
                        <div className="text-center mt-8">
                            <button 
                                onClick={() => setPage(page + 1)}
                                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                            >
                                Xem thêm
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default New;
