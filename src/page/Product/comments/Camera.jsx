import { useEffect, useRef, useState } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";

function Camera({ isOpen, onClose, onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        if (isOpen) {
            openCamera();
        } else {
            closeCamera();
        }
    }, [isOpen]);

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setStream(stream);
        } catch (error) {
            console.error("Không thể truy cập camera:", error);
        }
    };

    const startCountdown = () => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    captureImage();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        onCapture(imageData);
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
        setCountdown(null);
        onClose();
    };

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
                <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold text-gray-800">Chụp Ảnh Đánh Giá</h2>
                    <button
                        onClick={closeCamera}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="relative">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        className="w-full h-64 object-cover bg-black"
                    ></video>
                    
                    {countdown && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <span className="text-white text-4xl font-bold">{countdown}</span>
                            </div>
                        </div>
                    )}
                    
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>

                <div className="p-4 flex gap-3">
                    <button
                        onClick={startCountdown}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <FaCamera />
                        Chụp Ảnh
                    </button>
                    <button
                        onClick={closeCamera}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}
export default Camera;