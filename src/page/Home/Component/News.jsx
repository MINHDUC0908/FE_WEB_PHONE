import axios from "axios";
import { useEffect, useState } from "react";
import { api, formatTimeAgo, src } from "../../../Api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaArrowRightLong, FaTags } from "react-icons/fa6";
import { CiClock1 } from "react-icons/ci";
import { Link } from "react-router-dom";

function News() {
    const [news, setNews] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});
    const fetchNew = async () => {
        try {
            const res = await axios.get(api + "limitNew");
            if (res.data.status) {
                setNews(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    useEffect(() => {
        fetchNew();
    }, []);

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tin Tức Mới Nhất</h2>
                <div className="w-16 h-1 bg-blue-600 mx-auto mt-1"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="flex-2 md:w-3/5 flex flex-col gap-6">
                    {news.slice(0, 2).map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col md:flex-row border border-gray-200 p-1 h-full rounded-lg"
                        >
                            <div className="relative md:w-1/3 w-full h-64 md:h-auto overflow-hidden">
                                <LazyLoadImage
                                    src={`${src}imgNew/${item.images}`}
                                    alt={item.title}
                                    className={`w-full h-full object-cover rounded-xl transition-all duration-300 ease-in-out hover:scale-110 ${
                                        loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                    }`}
                                    onLoad={() => handleImageLoad(item.id)}
                                    loading="lazy"
                                />
                            </div>
                            <div className="md:w-2/3 w-full p-5 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex items-center gap-2 text-[#717171] text-[16px] md:text-[18px] font-montserrat">
                                        <FaTags />
                                        <span>E-commerce</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#717171] text-[16px] md:text-[18px] font-montserrat">
                                        <CiClock1 />
                                        <span>{formatTimeAgo(item.created_at)}</span>
                                    </div>
                                </div>
                                <p className="text-[20px] md:text-[24px] font-montserrat mt-2 text-[#121111]">
                                    {item.title}
                                </p>
                                <div
                                    className="prose max-w-none text-gray-600 mb-4 flex-1"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            item.outstanding.length > 300
                                                ? item.outstanding.substring(0, 300) + "..."
                                                : item.outstanding,
                                    }}
                                />
                                <div className="mt-auto">
                                    <Link
                                        to={`/new/${item.title}`} 
                                        state={{ id: item.id }} 
                                        className="inline-flex gap-2 items-center text-[16px] md:text-[18px] text-[#717171] font-montserrat transition-colors hover:text-black"
                                    >
                                        Đọc ngay <FaArrowRightLong className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {news.length > 2 && (
                    <div className="flex-1 md:w-2/5 border border-gray-200 flex flex-col rounded-lg p-1">
                        <div className="relative w-full h-64 overflow-hidden">
                            <LazyLoadImage
                                src={`${src}imgNew/${news[2].images}`}
                                alt={news[2].title}
                                className={`w-full h-full object-cover rounded-xl transition-all duration-700 ease-in-out hover:scale-110 ${
                                    loadedImages[news[2].id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                }`}
                                onLoad={() => handleImageLoad(news[2].id)}
                                loading="lazy"
                            />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 text-[#717171] text-[16px] md:text-[18px] font-montserrat">
                                    <FaTags />
                                    <span>E-commerce</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#717171] text-[16px] md:text-[18px] font-montserrat">
                                    <CiClock1 />
                                    <span>{formatTimeAgo(news[2].created_at)}</span>
                                </div>
                            </div>
                            <p className="text-[20px] md:text-[24px] font-montserrat text-[#121111]">
                                {news[2].title}
                            </p>
                            <div
                                className="prose max-w-none text-gray-600 mb-4 flex-1"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        news[2].outstanding.length > 300
                                            ? news[2].outstanding.substring(0, 300) + "..."
                                            : news[2].outstanding,
                                }}
                            />
                            <div className="mt-auto">
                                <Link
                                    to={`/new/${news[2].title}`} 
                                    state={{ id: news[2].id }} 
                                    className="inline-flex gap-2 items-center text-[16px] md:text-[18px] text-[#717171] font-montserrat transition-colors hover:text-black"
                                >
                                    Đọc ngay <FaArrowRightLong className="ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default News;
