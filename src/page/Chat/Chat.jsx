import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { format } from "date-fns";
import { isAfter, isSameDay, addMinutes } from "date-fns";
import { LuSend } from "react-icons/lu";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { useChat } from "../../Context/ChatContext";
import "../Chat/ChatStyle.css";


function Chat() {
    const [show, setShow] = useState(false);
    const chatEndRef = useRef(null);
    const [emojis, setEmojis] = useState(false);
    const {
        messages,
        messagess,
        message,
        setMessage,
        sendMessage,
        newMessageCount,
        setNewMessageCount,
        formatTime,
        handleTimeStamp,
        selectedTimes,
      } = useChat();
    const popularEmojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
        '❤️', '👍', '👏', '🎉', '🌟', '🚀', '💡', '🤔',
        '😎', '🤗', '😜', '😝', '🤭', '😬', '😳', '😌',
        '😏', '🤤', '😋', '🤩', '🥳', '💀', '👀', '😋',
        '🥺', '🧐', '🤓', '🤪', '😈', '👻', '💖', '✨',
        '💅', '🧠', '🫶', '🍀', '🌈', '🦋', '🌸', '🥑',
        '🍉', '🍓', '🍌', '🍍', '🍒', '🥥', '🍓', '🥝',
        '🍒', '🥕', '🍔', '🍟', '🍕', '🍣', '🍦', '🍪',
        '🍩', '🍮', '🍰', '🧁', '🍫', '🍪', '🎂', '🍬',
        '🥧', '🍻', '🥂', '🍷', '🍸', '🍹', '🥃', '🍺',
        '🍾', '🍻', '🫖', '🍲', '🍛', '🍜', '🍣', '🥗',
        '🥟', '🍗', '🍖', '🍤', '🦐', '🦑', '🍚', '🍙'
    ];
    
    // Cuộn đến cuối khi mở chat
    useEffect(() => {
        if (show && chatEndRef.current) {
            chatEndRef.current.scrollIntoView();
        }
    }, [show]); // Chạy khi show thay đổi

    // Hàm cuộn đến cuối tin nhắn
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    const Emojis = () => {
        const handleEmojiClick = (emoji) => {
            setMessage(message + emoji); // Thêm emoji vào tin nhắn
            setEmojis(false);
        };
        return (
            <div className="absolute bottom-[68px] left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border p-2 grid grid-cols-8 gap-2 max-h-40 overflow-y-auto w-full custom-scroll">
                {popularEmojis.map((emoji, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-2xl hover:text-blue-500"
                        onClick={() => handleEmojiClick(emoji)}
                    >
                        {emoji}
                    </div>
                ))}
            </div>
        );        
    };
    const filteredMessages = messagess.reduce((acc, item, index, array) => {
        if (index === 0 || item.message !== array[index - 1].message) {
            acc.push(item);
        }
        return acc;
    }, []);
    if (newMessageCount > 0)
    {
        sessionStorage.setItem('newMessageCount', newMessageCount);
    }
    const session = sessionStorage.getItem('newMessageCount');
        
    // Hàm để reset số lượng tin nhắn mới khi xem tin nhắn
    const handleChatClick = () => {
        setShow(!show);
        sessionStorage.removeItem('newMessageCount');
        setNewMessageCount(0);
    };
    return (
        <>
            <div
                className="chat-icon lg:bottom-24 lg:right-10 right-1 bottom-36 w-12 h-12 lg:h-14 lg:w-14 z-50 relative"
                onClick={handleChatClick}
            >
                {
                    !show && session > 0 && (
                        <div className="notification-badge">{session}</div>
                    )
                }
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-7.5 2.5a2.5 2.5 0 01-2.5-2.5v-6a2.5 2.5 0 012.5-2.5h9a2.5 2.5 0 012.5 2.5v6a2.5 2.5 0 01-2.5 2.5H8.5z"
                    />
                </svg>
            </div>

            {show && (
                <div className="fixed z-50 right-10 bottom-44 w-80 bg-white rounded-lg shadow-lg border border-gray-200 ">
                    <div className="flex items-center justify-between bg-gray-500 text-white py-3 px-4 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src="./icon.png" alt="" className="rounded-full border-4 border-teal-400" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            </div>
                            <span className="font-semibold text-lg">DUCCOMPUTER</span>
                        </div>
                        <button className="text-white" onClick={() => {setShow(false); setNewMessageCount(0); sessionStorage.removeItem('newMessageCount');}}>
                            <IoIosClose size={33} />
                        </button>
                    </div>
                    <div className="relative">
                        <div className="h-[350px] overflow-y-auto px-4 py-3 bg-gray-50 custom-scroll relative">
                            {
                                filteredMessages.map((item, index) => {
                                    const currentTime = new Date(item.created_at);
                                    const prevTime = index > 0 ? new Date(filteredMessages[index - 1].created_at) : null;
                                    const showTime = !prevTime || isAfter(currentTime, addMinutes(prevTime, 10));
                                    const showTimeDay = !prevTime || !isSameDay(currentTime, prevTime);
                                    return (
                                        <div key={item.id}>
                                            {(showTimeDay || selectedTimes[item.id] === item.created_at)  && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-gray-500 text-xs">
                                                        {format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss")}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Nếu tin nhắn thuộc cùng ngày, chỉ hiển thị giờ phút giây */}
                                            {!showTimeDay && (showTime) && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-gray-500 text-xs">
                                                        {format(new Date(item.created_at), "HH:mm:ss")}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    {item.sender === "Admin" && (
                                                        <img src="/icon.png" alt="" className="rounded-full" />
                                                    )}
                                                </div>
                                                <div
                                                    className={`flex ${item.sender === "Customer" ? "justify-end" : "justify-start"} my-2 w-full`}
                                                >
                                                    <div className="max-w-[70%] p-3 rounded-lg bg-indigo-500 text-white cursor-pointer">
                                                        <p
                                                            className="text-sm"
                                                            onClick={() => handleTimeStamp(item.created_at, item.id)}
                                                        >
                                                            {item.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div ref={chatEndRef}></div>
                                        </div>
                                    )
                                })
                            }
                            {messages.map((msg, index) => {
                                const currentTime = new Date(msg.timestamp);
                                const prevTime = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                                const showTime = !prevTime || isAfter(currentTime, addMinutes(prevTime, 10));
                                return (
                                    <div key={index}>
                                        {(showTime || selectedTimes[msg.id] === msg.timestamp) && (
                                            <div className="flex justify-center my-2">
                                                <span className="text-gray-500 text-xs">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                {msg.sender === "Admin" && (
                                                    <img src="/icon.png" alt="" className="rounded-full" />
                                                )}
                                            </div>
                                            <div
                                                className={`flex ${msg.sender === "Customer" ? "justify-end" : "justify-start"} my-2 w-full`}
                                            >
                                                <div className="max-w-[70%] p-3 rounded-lg bg-indigo-500 text-white cursor-pointer">
                                                    <p
                                                        className="text-sm"
                                                        onClick={() => handleTimeStamp(msg.timestamp, msg.id)}
                                                    >
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div ref={chatEndRef}></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center px-2 py-3 border-t border-gray-200">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 py-3 px-1 text-sm outline-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />
                        <button className="ml-3 text-gray-600">
                            <TfiCommentsSmiley size={20} onClick={() => setEmojis(!emojis)}/>
                        </button>
                        <button className="ml-3 text-gray-600" onClick={sendMessage}>
                            <LuSend size={20} />
                        </button>
                        {emojis && <Emojis/>}
                    </div>
                </div>
            )}
        </>
    );
}

export default Chat;
