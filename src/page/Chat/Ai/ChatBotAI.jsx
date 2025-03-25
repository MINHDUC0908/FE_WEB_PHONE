import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../Chat/ChatStyle.css";
import { api } from "../../../Api";
import { IoClose, IoSend } from "react-icons/io5";
import { debounce } from "../../../utils/utlis";

function ChatBotAi() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState(() => {
        return JSON.parse(sessionStorage.getItem("chatAI")) || [];
    });
    const [loading, setLoading] = useState(false)
    const chatRef = useRef(null);
    const chatEndRef = useRef(null);

    // Gửi tin nhắn
    const sendMessage = debounce(
        async () => {
            if (!message.trim()) return;
    
            // Cập nhật tin nhắn của người dùng
            setMessages(prevMessages => [...prevMessages, { sender: "user", text: message }]);
            setMessage("");
    
            try {
                setLoading(true)
                const res = await axios.post(api + 'chatbot', { message });
                console.log("Phản hồi từ server:", res.data);
                setLoading(false)
                setMessages(prevMessages => [...prevMessages, { sender: "bot", text: res.data.data }]);
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
                setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Lỗi kết nối, vui lòng thử lại!" }]);
            } finally {
                setLoading(false)
            }
        }
    );
    useEffect(() => {
        if (show && chatEndRef.current) {
            chatEndRef.current.scrollIntoView();
        }
    }, [show]);
    // Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // Chỉ log khi messages thay đổi
    useEffect(() => {
        console.log("Tin nhắn mới:", messages);
        sessionStorage.setItem("chatAI",  JSON.stringify(messages))
    }, [messages]);
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };
    console.log("Tin nhắn mới:", messages);
    return (
        <div className="fixed bottom-5 right-5 z-50">
            {/* Nút mở chat */}
            <div
                className="chat-icon lg:bottom-44 lg:right-10 right-1 bottom-36 w-12 h-12 lg:h-14 lg:w-14 z-50 relative"
                onClick={() => setShow(!show)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "2rem", height: "2rem", color: "white" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 2C6.48 2 2 6.48 2 12c0 3.04 1.21 5.8 3.16 7.78L4 22l3.08-1.16C9.14 21.41 10.54 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zM8 10h.01M12 10h.01M16 10h.01M9 16h6"
                    />
                </svg>
            </div>

            {/* Hộp chat */}
            {show && (
                <div className="fixed z-50 right-10 bottom-64 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-scaleIn">
                    {/* Header chat */}
                    <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-xl">
                        <span className="font-bold">Chat với AI</span>
                        <button onClick={() => setShow(false)} className="text-lg hover:opacity-80 transition">
                            <IoClose size={20} />
                        </button>
                    </div>

                    {/* Nội dung chat */}
                    <div ref={chatRef} className="h-[350px] overflow-y-auto p-4 text-gray-700 space-y-2">
                        {messages.length === 0 ? (
                            <p className="text-sm italic text-center text-gray-400">Hãy nhập tin nhắn để bắt đầu...</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-xl text-sm max-w-[75%] ${
                                        msg.sender === "user"
                                            ? "bg-blue-500 text-white self-end ml-auto"
                                            : "bg-gray-100 text-black"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="p-3 rounded-xl text-sm text-black max-w-[75%] flex items-center animate-fadeIn">
                                <div className="dot-flashing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef}></div>
                    </div>

                    {/* Ô nhập tin nhắn */}
                    <div className="p-3 border-t flex items-center bg-gray-50 rounded-b-xl">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-l-xl outline-none text-sm"
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-r-xl hover:bg-blue-600 transition-all flex items-center"
                            onClick={sendMessage}
                        >
                            <IoSend size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBotAi;
