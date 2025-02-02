import React, { useEffect, useState } from 'react';
import banner_login from "../../assets/banner-login.png"
import { IoIosLock } from "react-icons/io";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../Api';
import { toast } from 'react-toastify';

function Register()
{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [errors, setErrors] = useState({});

    const navigate = useNavigate()
    const register = async () =>  {
        try {
            const response = await axios.post(api + "register", {
                name,
                email,
                password, 
                password_confirmation: passwordConfirmation
            });
            if (response.data.success)
            {
                navigate("/login")
                toast.success("Đăng kí thành công");
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data.errors;
                const errorMessages = Object.values(error.response.data.errors).flat();
                errorMessages.forEach(msg => toast.error(msg, {
                    autoClose: 3000,
                })); 
                setErrors(errorData);
            } else {
                setErrors({ general: "Đã có lỗi xảy ra khi gửi yêu cầu!" });
            }
        }
    }
    useEffect(() => {
        console.log(password)
    }, [password])
    useEffect(() => {
        console.log(passwordConfirmation)
    }, [passwordConfirmation])
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl space-y-8 border border-gray-5 mt-5 rounded-lg">
                    <div className="text-center">
                        <div className="relative flex justify-center mb-6">
                            <img 
                                src={banner_login} 
                                alt="Online Quiz Banner" 
                                className="w-full max-w-3xl object-cover"  
                            />
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                                <IoIosLock className="text-[#FF6347]" size={42} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-[#FF6347] mb-2">TRẮC NGHIỆM ONLINE</h2>
                        <p className="text-gray-600">Kiểm Tra Kiến Thức Hiệu Quả</p>
                    </div>
                    <div className="mt-8 p-8">
                        <h3 className="text-xl font-medium text-center mb-6">Đăng Nhập Tài Khoản Trắc Nghiệm Hay</h3>
                        <form method='POST' onSubmit={(e) => {e.preventDefault(); register()}} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                <input
                                    type="text"
                                    name='name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Họ và tên của bạn"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email hoặc số điện thoại</label>
                                <input
                                    type="text"
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Email hoặc số điện thoại"
                                />
                                
                            </div>
                            {/* <div className="flex space-x-4 w-full items-center justify-center">
                                <input
                                    type="text"
                                    className="mt-1 block rounded-md border w-full border-gray-300 px-3 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Mã xác nhận gồm 6 số"
                                />
                                <button
                                    type="submit"
                                    className="w-56  h-12 text-[14px] rounded-md bg-[#FF6347] px-4 py-2 text-white hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-offset-2"
                                    disabled
                                >
                                    Gửi mã xác nhận
                                </button>
                            </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <input
                                    name='password'
                                    placeholder='Nhập mật khẩu'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password[0]}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nhập lại Mật khẩu</label>
                                <input  
                                    name='password_confirmation'
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder='Nhập lại mật khẩu'
                                    type="password"
                                    className={`w-full p-3 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500">{errors.password_confirmation[0]}</p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 block text-sm text-gray-700">Hiện mật khẩu</label>
                            </div>
        
                            <button
                                type="submit"
                                className="w-full rounded-md bg-[#FF6347] px-4 py-2 text-white hover:bg-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:ring-offset-2"
                                >
                                Đăng kí
                            </button>
                        </form>
        
                        <div className="mt-6">
                        <p className="text-center text-sm text-gray-600">Hoặc đăng kí qua</p>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                                <FaGoogle/>
                                <span className="ml-2">Google</span>
                            </button>
                            <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                                <FaFacebookF/>
                                <span className="ml-2">Zalo</span>
                            </button>
                            <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                                <FaGithub/>
                                <span className="ml-2">Github</span>
                            </button>
                        </div>
                    </div>
        
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm">
                            <span className="text-gray-600">Bạn chưa có tài khoản? </span>
                            <a href="/login" className="font-medium text-[#FF6347] hover:text-[#FF4500]">
                                Đăng nhập
                            </a>
                        </div>
                            <a href="#" className="text-sm font-medium text-[#FF6347] hover:text-[#FF4500]">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default Register