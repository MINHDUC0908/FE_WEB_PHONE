import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { format } from "date-fns";
import { api } from "../Api";

const ChatContext = createContext();
export const ChatProvider = ( { children }) => {
    const token = localStorage.getItem("token");
    // Các state liên quan đến chat
    const [messages, setMessages] = useState([]); // Lưu trữ tin nhắn từ Pusher
    const [messagess, setMessagess] = useState([]); // Lưu trữ tin nhắn từ API
    const [message, setMessage] = useState(""); // Tin nhắn hiện tại từ input
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [selectedTimes, setSelectedTimes] = useState({});

    // Cấu hình Pusher để lắng nghe event
    useEffect(() => {
        const pusher = new Pusher("c44c17ba15a1c83ce51d", {
            cluster: "ap1",
            forceTLS: true,
        });

    const channel = pusher.subscribe("chat.message");

    channel.bind("ChatMessageSent", (event) => {
        setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
                (msg) => msg.message === event.message && msg.timestamp === event.timestamp
            );
            if (!isDuplicate) 
            {
                if (event.sender === "Admin") {
                    setNewMessageCount((prevCount) => prevCount + 1);
                }
                return [
                    ...prevMessages,
                    { 
                        sender: event.sender,
                        message: event.message,
                        timestamp: event.timestamp,
                    },
                ];
            }
            return prevMessages;
        });
    });

        return () => {
            pusher.unsubscribe("chat.message");
            pusher.disconnect();
        };
    }, []);
    // API: Gửi tin nhắn
    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            const response = await axios.post(
                api + "send-message-fe",
                { message },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );
            if (response.status === 200) {
                setMessage(""); // Reset input sau khi gửi
            }
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
    };
    // API: Lấy danh sách tin nhắn (index)
    const indexMessage = async () => {
        try {
            if (!messagess || messagess.length === 0) {
                const result = await axios.get(api + "message-fe", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (result && result.data) {
                    setMessagess(result.data.data);
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    useEffect(() => {
        if (token) {
          indexMessage();
        }
    }, [token]);

    // Hàm định dạng thời gian sử dụng date-fns
    const formatTime = (timestamp) => {
        return format(new Date(timestamp), "HH:mm:ss");
    };

    // Hàm thay đổi timestamp của tin nhắn (có thể dùng cho hiển thị thông tin chi tiết)
    const handleTimeStamp = (timestamp, msgId) => {
        setSelectedTimes((prevTimes) => ({
            ...prevTimes,
            [msgId]: prevTimes[msgId] === timestamp ? null : timestamp,
        }));
    };
    return (
        <ChatContext.Provider
            value={{
                messages,
                messagess,
                message,
                setMessage,
                sendMessage,
                newMessageCount,
                setNewMessageCount,
                formatTime,
                handleTimeStamp,
                setSelectedTimes,
                selectedTimes
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const useChat  = () => useContext(ChatContext); 
