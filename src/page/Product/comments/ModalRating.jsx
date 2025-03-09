import { src } from "../../../Api";
import { useRating } from "../../../Context/RatingContext";
import { useEffect, useState } from "react";

function ModalRating({ product, setShowRating  }) {
    const { ratings, loading, setProduct_id } = useRating()
  
    useEffect(() => {
        if (product?.id) {
            setProduct_id(product.id);
        }
    }, [product?.id, setProduct_id]);

    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
        }).format(date);
    };
  
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowRating(false)}/>
            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Đánh giá sản phẩm: 
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text ml-2">
                            {product.product_name}
                        </span>
                    </h2>
                    <button 
                        onClick={() => setShowRating(false)}
                        className="text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                {
                    ratings && ratings.length > 0 && (
                        <div>
                            <div className="flex flex-col md:flex-row items-center justify-center bg-blue-50 rounded-lg p-6 mb-6">
                                <div className="text-center md:border-r md:border-gray-300 md:pr-8 mb-4 md:mb-0">
                                    <div className="text-5xl font-bold text-blue-600 mb-2">
                                        {Math.ceil(product.ratings_avg_rating * 10) / 10}
                                    </div>
                                    <div className="flex justify-center mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                            key={star}
                                            className="w-6 h-6 text-yellow-400"
                                            fill={star <= product.ratings_avg_rating ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                            ></path>
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-sm">{ratings.length} đánh giá</p>
                                </div>
                                <div className="md:pl-8 w-full md:w-2/3">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratings.filter(r => r.rating === star).length;
                                        const percentage = (count / ratings.length) * 100;
                                        
                                        return (
                                            <div key={star} className="flex items-center mb-2">
                                                <span className="text-gray-700 text-sm w-4">{star}</span>
                                                <svg className="w-5 h-5 mx-2" viewBox="0 0 20 20" fill="#facc15">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                                <div className="w-full mx-2 h-3 bg-gray-200 rounded-full">
                                                    <div 
                                                    className="h-3 bg-red-600 rounded-full" 
                                                    style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="w-8 text-xs text-right text-gray-600">{count}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        
                            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                                {ratings.map((rating) => (
                                    <div key={rating.id} className="border-b border-gray-200 pb-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mr-4">
                                            {rating.customer.image ? (
                                                <img 
                                                    src={src +`storage/imgCustomer/${rating.customer.image}`} 
                                                    alt={rating.customer.name} 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                    onError={(e) => { e.target.src = '/placeholder-avatar.png' }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {rating.customer?.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-gray-800">{rating.customer?.name || "Người dùng ẩn danh"}</h4>
                                                    <span className="text-xs text-gray-500">{formatDate(rating.created_at)}</span>
                                                </div>
                                                <div className="flex my-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className="w-4 h-4 text-yellow-400"
                                                            fill={star <= rating.rating ? "currentColor" : "none"}
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                            ></path>
                                                        </svg>
                                                    ))}
                                                </div>
                                                {rating.comment && (
                                                    <p className="text-gray-700 mt-2">{rating.comment}</p>
                                                )}
                                                <div>
                                                    {rating.image && rating.image.length > 0 && (
                                                        <div className="flex items-center mt-2">
                                                            <img 
                                                                src={src + `storage/rating/${rating.image}`} 
                                                                alt={rating.customer.name} 
                                                                className="w-32 h-full mr-2 rounded-lg object-cover"
                                                                onError={(e) => { e.target.src = '/placeholder-image.png' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default ModalRating;