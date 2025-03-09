import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send } from 'lucide-react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { api, src } from '../../../Api';
import { toast } from 'react-toastify';
import { useCommentData } from '../../../Context/CommentContext';


export const CommentSystem = ({ product }) => {
    const token = localStorage.getItem('token');
    const { 
        comments, 
        setId_product, 
        newCommentContent, 
        setNewCommentContent, 
        handleSubmitComment ,
        handleReplyAdded,
        inputRef,
    } = useCommentData();
    const [visibleComment, setVisibleComment] = useState(5);
    const displayComment = comments.slice(0, visibleComment);
    const hasMoreComment = visibleComment < comments.length;

    useEffect(() => {
        if (product) {
            setId_product(product.id);
        }
    }, [product, setId_product]);

    const handleLoadMore = () => {
        setVisibleComment((prev) => prev + 5);
    };


    // Component hiển thị bình luận con (reply)
    const ReplyItem = ({ reply, parentCommentId, depth = 0 }) => {
        const [showReplyInput, setShowReplyInput] = useState(false);
        const [replyContent, setReplyContent] = useState('');
        const [visibleNestedReply, setVisibleNestedReply] = useState(1);

        const displayNestedReply = reply.replies 
            ? reply.replies.slice(0, visibleNestedReply) 
            : [];

        const hasMoreNestedReply = reply.replies 
            ? visibleNestedReply < reply.replies.length 
            : false;

        const handleLoadMoreNestedReply = () => {
            setVisibleNestedReply((prev) => prev + 5);
        };

        // Ẩn tất cả bình luận con khi nhấn "Ẩn bớt phản hồi"
        const handleHideNestedReply = () => {
            setVisibleNestedReply(0);
        };

        const handleReply = async () => {
            if (!replyContent.trim()) return;
            if (!token) {
                toast.error('Vui lòng đăng nhập để trả lời');
                return;
            }

            try {
                const response = await axios.post(
                    api + `products/${product.id}/comments`, 
                    { 
                        content: replyContent,
                        parent_id: reply.id 
                    }, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.data.comment) {
                    // Cập nhật danh sách phản hồi ngay lập tức
                    handleReplyAdded(response.data.comment);
                    setReplyContent('');
                    setShowReplyInput(false);
                }                
            } catch (error) {
                console.error('Error submitting reply:', error);
                toast.error('Lỗi khi gửi trả lời. Vui lòng thử lại.');
            }
        };

        const imagePath =
            reply.author_type === 'admin'
                ? `storage/profile_images/${reply.author_details?.image}`
                : reply.author_type === 'customer'
                ? `storage/imgCustomer/${reply.author_details?.image}`
                : null;

        return (
            <div 
                className={`bg-gray-50 rounded-lg p-3 mb-2 ${
                depth > 0 ? 'ml-' + (depth * 4) : ''
                }`}
            >
                <div className="flex items-center mb-2">
                    {imagePath && (
                        <img
                            src={src + imagePath}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-2"
                        />
                    )}
                    <div>
                        <p className="font-semibold text-gray-700">{reply.author}</p>
                        <p className="text-xs text-gray-500">{reply.author_type}</p>
                    </div>
                </div>
                <p className="text-gray-600 mb-2">{reply.content}</p>
                
                {/* Nút trả lời */}
                <button 
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                    <MessageCircle className="w-4 h-4 mr-1" /> Trả lời
                </button>

                {/* Input trả lời */}
                {showReplyInput && (
                    <div className="mt-3 border-t pt-3">
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Nhập câu trả lời"
                                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                onClick={handleReply}
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Các reply con */}
                {displayNestedReply.length > 0 && (
                    <div className="mt-4">
                        {displayNestedReply.map(nestedReply => (
                            <ReplyItem 
                                key={nestedReply.id} 
                                reply={nestedReply} 
                                parentCommentId={parentCommentId}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}

                {/* Nút xem thêm reply con */}
                {hasMoreNestedReply ? (
                    <button 
                        onClick={handleLoadMoreNestedReply}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center"
                    >
                        <IoIosArrowDown className="mr-1" /> 
                        Xem thêm phản hồi
                    </button>
                ) : (
                    visibleNestedReply > 0 && (
                        <button 
                            onClick={handleHideNestedReply}
                            className="text-red-600 hover:text-red-800 text-sm mt-2 flex items-center"
                        >
                            <IoIosArrowUp className="mr-1" />
                            Ẩn bớt phản hồi
                        </button>
                    )
                )}
            </div>
        );
    };


    // Component hiển thị bình luận gốc
    const CommentItem = ({ comment }) => {
        const [showReplyInput, setShowReplyInput] = useState(false);
        const [replyContent, setReplyContent] = useState('');
        const [visibleCommentReply, setVisibleCommentReply] = useState(1);

        const displayCommentReply = comment.replies 
            ? comment.replies.slice(0, visibleCommentReply) 
            : [];
        
        const hasMoreCommentReply = comment.replies 
            ? visibleCommentReply < comment.replies.length 
            : false;

        const handleLoadMoreReply = () => {
            setVisibleCommentReply((prev) => prev + 5);
        };

        const handleReply = async () => {
            if (!replyContent.trim()) return;
            if (!token) {
                toast.error('Vui lòng đăng nhập để trả lời');
                return;
            }

            try {
                const response = await axios.post(
                    api + `products/${product.id}/comments`, 
                    { 
                        content: replyContent,
                        parent_id: comment.id 
                    }, 
                    { 
                        headers: { 
                            Authorization: `Bearer ${token}` 
                        } 
                    }
                );

                setReplyContent('');
                setShowReplyInput(false);
                handleReplyAdded(response.data.comment);
            } catch (error) {
                console.error('Error submitting reply:', error);
                toast.error('Lỗi khi gửi trả lời. Vui lòng thử lại.');
            }
        };
        console.log(comment)
        return (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                {/* Thông tin bình luận gốc */}
                <div className="flex items-center mb-2">
                    {comment.author_details.image && (
                        <img 
                            src={src + `storage/imgCustomer/${comment.author_details.image}`} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-2"
                        />
                    )}
                    <div>
                        <p className="font-semibold text-gray-800">{comment.author}</p>
                        <p className="text-sm text-gray-500">{comment.author_type}</p>
                    </div>
                </div>

                <p className="text-gray-700 mb-3">{comment.content}</p>
                
                {/* Nút trả lời bình luận gốc */}
                <button 
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                    <MessageCircle className="w-4 h-4 mr-1" /> Trả lời
                </button>

                {/* Input trả lời bình luận gốc */}
                {showReplyInput && (
                    <div className="mt-3 border-t pt-3">
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Nhập câu trả lời"
                                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                onClick={handleReply}
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Các reply của bình luận gốc */}
                {displayCommentReply.length > 0 && (
                    <div className="ml-6 mt-4 border-l-2 border-gray-200 pl-4">
                        {displayCommentReply.map(reply => (
                            <ReplyItem 
                                key={reply.id} 
                                reply={reply} 
                                parentCommentId={comment.id}
                            />
                        ))}
                    </div>
                )}

                {/* Nút xem thêm reply */}
                {hasMoreCommentReply ? (
                    <button 
                        onClick={handleLoadMoreReply}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center ml-6"
                    >
                        <IoIosArrowDown className="mr-1" /> 
                        Xem thêm phản hồi ({comment.replies.length - visibleCommentReply})
                    </button>
                ) : (
                    visibleCommentReply > 1 && (
                        <button 
                            onClick={() => setVisibleCommentReply(1)}
                            className="text-red-600 hover:text-red-800 text-sm mt-2 flex items-center ml-6"
                        >
                            <IoIosArrowUp className="mr-1" />
                            Ẩn bớt phản hồi
                        </button>
                    )
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Bình Luận Sản Phẩm</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        ref={inputRef}
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className="flex-grow p-3 border-2 border-gray-200 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 
                                transition duration-300"
                    />
                    <button
                        onClick={handleSubmitComment}
                        className="bg-blue-500 text-white p-3 rounded-lg 
                                hover:bg-blue-600 transition duration-300 
                                flex items-center gap-2 
                                active:scale-95"
                    >
                        <Send className="w-6 h-6 mr-2" /> Gửi
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div>
                {displayComment.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                    />
                ))}
            </div>

            {hasMoreComment && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMore}
                        className="flex items-center gap-2 px-5 py-2.5 
                                border-2 border-blue-200 text-blue-600 
                                rounded-lg text-sm bg-white 
                                hover:bg-blue-50 transition-all duration-300 
                                shadow-sm hover:shadow-md active:scale-95"
                    >
                        <IoIosArrowDown className="text-blue-500 text-lg" />
                        Xem thêm bình luận ({comments.length - visibleComment})
                    </button>
                </div>
            )}

            {comments.length === 0 && (
                <div className="text-center text-gray-500 mt-10 
                                bg-gray-50 py-8 rounded-lg">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
            )}
        </div>
    );
};