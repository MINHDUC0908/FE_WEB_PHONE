import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function New({ setCurrentTitle }) {
    useEffect(() => {
        setCurrentTitle("Tin tức - DUC COMPUTER");
    }, [setCurrentTitle]);

    const [newTitle, setNewTitle] = useState([]);
    const [error, setError] = useState("");

    const fetchNew = async () => {
        try {
            const result = await axios.get("http://127.0.0.1:8000/api/news");
            if (result && result.data) {
                setNewTitle(result.data.data);
                setError("");
            }
        } catch (error) {
            setError("Không thể tải danh sách tin tức. Vui lòng thử lại sau!");
            console.error("Error fetching news:", error);
        }
    };

    useEffect(() => {
        fetchNew();
    }, [newTitle]);
    return (
        <>
            <hr />
            <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 my-10">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : newTitle.length > 0 ? (
                    newTitle.map((item) => (
                        <Link to={`/new/${item.title}`} key={item.id} state={{ id: item.id }}> 
                            <div className="grid grid-cols-4 gap-4 my-10">
                                <div>
                                    <img
                                        src={`http://127.0.0.1:8000/imgnew/${item.images}`}
                                        alt={item.title}
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="col-span-3 ml-5">
                                    <h3 className="font-semibold text-red-600 text-3xl">
                                        {item.title}
                                    </h3>
                                    <div
                                        className="prose max-w-none text-gray-600 text-sm"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 5,
                                            overflow: "hidden",
                                            minHeight: "4.5rem",
                                            lineHeight: "1.5rem",
                                        }}
                                        dangerouslySetInnerHTML={{ __html: item.outstanding }}
                                    />
                                </div>
                            </div>
                            <hr />
                        </Link>
                    ))
                ) : (
                    <p>No news available.</p>
                )}
            </div>
        </>
    );
}

export default New;
