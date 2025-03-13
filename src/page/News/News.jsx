import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api, src } from "../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

// Component Card tin tức riêng biệt để code sạch hơn
const NewsCard = ({ item, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
  
    return (
        <Link 
            to={`/new/${item.title}`} 
            state={{ id: item.id }} 
            className="group flex flex-col h-full bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden transform hover:-translate-y-1"
            aria-label={`Xem tin tức: ${item.title}`}
        >
            <div className="relative w-full h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <LazyLoadImage
                    src={`${src}imgNew/${item.images}`}
                    alt={item.title}
                    threshold={300}
                    effect="blur"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                    wrapperClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                    {item.title}
                </h3>
                
                <p 
                    className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3 flex-grow"
                    dangerouslySetInnerHTML={{ __html: item.outstanding }}
                />
                
                <div className="mt-4 pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center text-red-500 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                        Xem chi tiết 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
};

// Component Skeleton Loading riêng biệt
const SkeletonCard = () => (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
        <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
        <div className="p-5">
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
        <div className="mt-4 pt-2 border-t border-gray-100">
            <div className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></div>
        </div>
        </div>
    </div>
);

function New({ setCurrentTitle }) {
    const [news, setNews] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setCurrentTitle("Tin tức - DUC COMPUTER");
        document.title = "Tin tức - DUC COMPUTER";
    }, [setCurrentTitle]);

    const fetchNews = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(`${api}news`, {
                headers: { "Cache-Control": "no-cache" },
            });
            
            if (result?.data?.data) {
                setNews(result.data.data);
                setError("");
            } else {
                throw new Error("Dữ liệu không hợp lệ");
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setError("Không thể tải danh sách tin tức. Vui lòng thử lại sau!");
        } finally {
         setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchNews();
        }, 500);
        return () => clearTimeout(timeout);
    }, [fetchNews]);

    // Xử lý loadmore
    const displayedNews = news.slice(0, page * itemsPerPage);
    const hasMoreNews = displayedNews.length < news.length;
  
    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <section className="bg-gray-50 py-12 sm:py-16">
            <div className="container mx-auto px-4 xl:px-16 2xl:px-28">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 uppercase relative inline-block">
                        Tin tức mới nhất
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cập nhật những thông tin công nghệ mới nhất từ DUC COMPUTER
                    </p>
                </div>

                {error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-500 text-lg font-medium">{error}</p>
                        </div>
                        <button 
                        onClick={fetchNews}
                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                        Thử lại
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {isLoading
                                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                                    <SkeletonCard key={index} />
                            ))
                                : displayedNews.map((item, index) => (
                                    <NewsCard key={item.id} item={item} index={index} />
                            ))}
                        </div>

                        {/* Nút Xem thêm */}
                        {hasMoreNews && !isLoading && (
                            <div className="text-center mt-10">
                                <button 
                                    onClick={handleLoadMore}
                                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center mx-auto"
                                >
                                    <span>Xem thêm tin tức</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        
                        {/* Trường hợp không có tin tức */}
                        {!isLoading && news.length === 0 && (
                            <div className="text-center py-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có tin tức nào</h3>
                                <p className="text-gray-500">Vui lòng quay lại sau!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default New;