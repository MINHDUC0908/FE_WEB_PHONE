import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../Api";
import { toast } from "react-toastify";

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [id_product, setId_product] = useState(""); // ID sản phẩm
    const [newCommentContent, setNewCommentContent] = useState("");
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const token = localStorage.getItem("token");
    const inputRef = useRef()
    // Fetch bình luận từ API khi id_product thay đổi
    const fetchComments = async () => {
        if (!id_product) return;
        setLoading(true);
        try {
            const res = await axios.get(`${api}products/${id_product}/comments`);
            setComments(res.data.comments || []);
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
            toast.error("Không thể tải bình luận, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (id_product)
        {
            fetchComments()
        }
    }, [id_product])
    const handleSubmitComment = async () => {
        if (!newCommentContent.trim()) {
            toast.error("Nội dung bình luận không được để trống!");
            return;
        }
        if (!token) {
            toast.error("Vui lòng đăng nhập để bình luận");
            return;
        }
        if (!id_product) {
            toast.error("Sản phẩm không hợp lệ!");
            return;
        }

        try {
            const response = await axios.post(
                `${api}products/${id_product}/comments`,
                { content: newCommentContent },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.comment) {
                await fetchComments()
                setNewCommentContent("");
                inputRef.current.focus();
                toast.success("Bình luận đã được gửi!");
            } else {
                toast.error("Có lỗi xảy ra khi gửi bình luận.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
            toast.error("Không thể gửi bình luận, vui lòng thử lại.");
        }
    };
    // Hàm đệ quy để cập nhật bình luận
    const updateNestedComments = (comments, newReply) => {
        return comments.map(comment => {
            // Nếu đây là bình luận gốc
            if (comment.id === newReply.parent_id) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }

            // Kiểm tra các reply của bình luận
            if (comment.replies) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply => {
                        // Nếu tìm thấy reply cha của reply mới
                        if (reply.id === newReply.parent_id) {
                            return {
                                ...reply,
                                replies: [...(reply.replies || []), newReply]
                            };
                        }

                        // Kiểm tra các reply của reply
                        if (reply.replies) {
                            return {
                                ...reply,
                                replies: updateNestedComments(reply.replies, newReply)
                            };
                        }

                        return reply;
                    })
                };
            }

            return comment;
        });
    };

    // Cập nhật bình luận khi có phản hồi được thêm vào
    const handleReplyAdded = (newReply) => {
        const updatedComments = updateNestedComments(comments, newReply);
        fetchComments()    
    };
    return (
        <CommentContext.Provider value={{ 
            comments, 
            setId_product, 
            setComments, 
            handleSubmitComment, 
            newCommentContent, 
            setNewCommentContent, 
            loading ,
            fetchComments,
            updateNestedComments,
            handleReplyAdded,
            inputRef
        }}>
            {children}
        </CommentContext.Provider>
    );
};

// Hook để lấy dữ liệu comment
export const useCommentData = () => useContext(CommentContext);
