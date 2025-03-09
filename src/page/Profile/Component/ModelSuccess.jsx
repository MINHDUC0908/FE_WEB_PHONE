

export const ModalSuccess = ({setModal}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setModal(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-center animate-fadeIn">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <p className="text-lg font-medium mt-4">Cập nhật hồ sơ</p>
            </div>
        </div>
    );
};