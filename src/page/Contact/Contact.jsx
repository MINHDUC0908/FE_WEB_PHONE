import { useEffect } from "react";

function Contact({ setCurrentTitle }) {
  useEffect(() => {
    setCurrentTitle('Liên Hệ - DUC COMPUTER');
  }, [setCurrentTitle]);

    return (
        <div className="container mx-auto 2xl:px-28 px-4 xl:px-10 py-12 font-sans">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-semibold text-gray-800">Liên Hệ với Chúng Tôi</h1>
                <p className="text-lg text-gray-500">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Thông Tin Liên Hệ</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Bạn có thể liên hệ với chúng tôi qua các kênh sau:
                    </p>
                    <ul className="space-y-4 text-lg text-gray-700">
                        <li>
                            <strong>Địa chỉ:</strong> Thôn Hòa Lâm, Duy Trung, Duy Xuyên, Quảng Nam
                        </li>
                        <li>
                            <strong>Điện thoại:</strong> (+84) 386413805
                        </li>
                        <li>
                            <strong>Email:</strong> <a href="https://mail.google.com/mail/u/0/?pli=1#inbox" className="text-blue-600">ducle090891999@gmail.com</a>
                        </li>
                        <li>
                            <strong>Facebook:</strong> <a href="https://www.facebook.com/minh.uc.867215" target="_blank" className="text-blue-600">duccomputer</a>
                        </li>
                        <li>
                            <strong >Instagram:</strong> <a href="https://www.instagram.com/minhduc9805/" target="_blank" className="text-blue-600">duccomputer</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Gửi Thông Tin Liên Hệ</h2>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Họ và Tên</label>
                            <input
                                type="text"
                                name="name"
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập họ và tên của bạn"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Số Điện Thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700">Nội Dung Liên Hệ</label>
                            <textarea
                                name="message"
                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows="4"
                                placeholder="Nhập nội dung liên hệ"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            Gửi Thông Tin
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Tìm Chúng Tôi Trên Bản Đồ</h2>
                <div className="relative w-full h-96">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.850330431049!2d106.66017211534755!3d10.762622259333505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c4d3b57f257%3A0x4ee7a57512932b1!2zMTIzIMSQLi1NQkMgdGggVGjDoSBUaMawIFggUOG7oiBNb3QuYmLhIFjTtG5E!5e0!3m2!1svi!2s!4v1652225451237!5m2!1svi!2s"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default Contact;
