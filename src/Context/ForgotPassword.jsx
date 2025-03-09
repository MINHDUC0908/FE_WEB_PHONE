import axios from "axios";
import { createContext, useContext, useState } from "react";
import { api } from "../Api";
import { toast } from "react-toastify";


const forgotPassword = createContext();

export const ForgotProvider = ({ children }) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleForgotPassword = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(api + "forgot-password", { email });
            if (res.data.status == "success")
            {
                setEmail("");
                toast.success(res.data.message)
            } else if (res.data.status == false )
            {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi gửi yêu cầu.");
        } finally {
            setIsLoading(false);
        }
    };    
    return (
        <forgotPassword.Provider value={{setEmail, handleForgotPassword, email, isLoading}} >
            {children}
        </forgotPassword.Provider>
    )
}
export const forgotData = () => useContext(forgotPassword)