import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

// Import hình ảnh
import anh1 from "../../../assets/evaluate/1.png";
import anh2 from "../../../assets/evaluate/2.png";
import anh3 from "../../../assets/evaluate/3.png";
import anh4 from "../../../assets/evaluate/4.png";
import backgroundImage from "../../../assets/evaluate/background.jpg"; // Giả định bạn sẽ thêm ảnh này

function Evaluate() {
    // Đa dạng hóa nội dung testimonial
    const testimonials = [
        {
            id: 1,
            name: 'Trần Văn Anh',
            location: 'Hồ Chí Minh',
            comment: 'Sản phẩm chất lượng cao và giá cả hợp lý. Tôi đặc biệt ấn tượng với thời gian giao hàng nhanh chóng và cách đóng gói cẩn thận.',
            avatar: anh1,
            rating: 5,
            date: '15/01/2025'
        },
        {
            id: 2,
            name: 'Nguyễn Thị Hương',
            location: 'Hà Nội',
            comment: 'Dịch vụ khách hàng tuyệt vời, nhân viên nhiệt tình và chuyên nghiệp. Tôi đã mua laptop tại đây và được tư vấn rất chi tiết về cấu hình phù hợp với nhu cầu.',
            avatar: anh2,
            rating: 4,
            date: '03/02/2025'
        },
        {
            id: 3,
            name: 'Phương Ly',
            location: 'Hải Phòng',
            comment: 'Chế độ bảo hành rất tốt. Khi sản phẩm gặp vấn đề, tôi đã được hỗ trợ sửa chữa nhanh chóng và không tốn thêm chi phí phát sinh nào.',
            avatar: anh3,
            rating: 5,
            date: '27/01/2025'
        },
        {
            id: 4,
            name: 'Nguyễn Văn Tuấn',
            location: 'Đà Nẵng',
            comment: 'Mua điện thoại ở đây được 6 tháng và tôi rất hài lòng. Giá tốt hơn so với nhiều cửa hàng khác, và còn được tặng kèm ốp lưng cao cấp.',
            avatar: anh4,
            rating: 4,
            date: '10/02/2025'
        },
        {
            id: 5,
            name: 'Lê Minh Hà',
            location: 'Cần Thơ',
            comment: 'Website dễ sử dụng, tìm kiếm sản phẩm nhanh chóng. Tôi đặc biệt thích chương trình khuyến mãi hàng tháng với nhiều ưu đãi hấp dẫn.',
            avatar: anh2,
            rating: 5,
            date: '05/01/2025'
        },
        {
            id: 6,
            name: 'Hoàng Đức Thịnh',
            location: 'Nghệ An',
            comment: 'Chính sách đổi trả linh hoạt, tôi đã đổi màu cho chiếc tai nghe sau khi mua và được nhân viên hỗ trợ rất nhiệt tình, không gây khó dễ.',
            avatar: anh1,
            rating: 4,
            date: '19/02/2025'
        },
        {
            id: 7,
            name: 'Lê Minh Hà',
            location: 'Cần Thơ',
            comment: 'Website dễ sử dụng, tìm kiếm sản phẩm nhanh chóng. Tôi đặc biệt thích chương trình khuyến mãi hàng tháng với nhiều ưu đãi hấp dẫn.',
            avatar: anh2,
            rating: 5,
            date: '05/01/2025'
        },
        {
            id: 8,
            name: 'Hoàng Đức Thịnh',
            location: 'Nghệ An',
            comment: 'Chính sách đổi trả linh hoạt, tôi đã đổi màu cho chiếc tai nghe sau khi mua và được nhân viên hỗ trợ rất nhiệt tình, không gây khó dễ.',
            avatar: anh1,
            rating: 4,
            date: '19/02/2025'
        }
    ];

    // Thêm state để theo dõi testimonials đang hiển thị
    const [currentPage, setCurrentPage] = useState(0);
    const testimonialsPerPage = 4;
    const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);
    
    // Tính toán testimonials hiển thị hiện tại
    const visibleTestimonials = testimonials.slice(
        currentPage * testimonialsPerPage,
        (currentPage + 1) * testimonialsPerPage
    );
    
    // Chuyển trang
    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % pageCount);
    };
    
    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
    };
    
    // Auto rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            nextPage();
        }, 8000);
        
        return () => clearInterval(interval);
    }, [currentPage]);

    // Render stars rating
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={18} 
                        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} mr-1`}
                    />
                ))}
            </div>
        );
    };

    // Thống kê
    const stats = [
        { value: '50,000+', label: 'Khách hàng' },
        { value: '4.8', label: 'Đánh giá trung bình' },
        { value: '98%', label: 'Khách hàng hài lòng' }
    ];

    return (
        <div className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative inline-block">
                        <span className="relative z-10">Khách hàng nói gì về chúng tôi</span>
                        <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-100 -z-10"></span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                        Chúng tôi luôn lắng nghe ý kiến từ khách hàng để không ngừng cải thiện 
                        chất lượng dịch vụ và sản phẩm
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600 relative h-full min-h-[400px] lg:min-h-[600px] shadow-lg">
                        <div className="absolute inset-0">
                            <img 
                                src={backgroundImage} 
                                alt="Satisfied customer" 
                                className="w-full h-full object-cover transition duration-300 hover:scale-105"
                            />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="p-8 text-center max-w-lg">
                                <h3 className="text-white text-3xl font-extrabold mb-6 drop-shadow-lg">
                                    Trải nghiệm mua sắm tuyệt vời
                                </h3>
                                
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center border border-white/30">
                                            <div className="text-white text-2xl font-bold">{stat.value}</div>
                                            <div className="text-white/80 text-sm">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/30 mb-8">
                                    <Quote className="text-white/60 h-8 w-8 mb-2" />
                                    <p className="text-white italic font-light text-lg">
                                        "Chúng tôi không chỉ bán sản phẩm, mà còn mang đến trải nghiệm và sự hài lòng cho khách hàng"
                                    </p>
                                </div>
                                
                                <Link to="/product">
                                    <button className="bg-white text-yellow-600 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-yellow-50 transition duration-300 transform hover:scale-105">
                                        Mua sắm ngay
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-700">Đánh giá nổi bật</h3>
                            <div className="flex items-center">
                                <button 
                                    onClick={prevPage}
                                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 mr-2"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={nextPage}
                                    className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {visibleTestimonials.map((testimonial) => (
                                <div 
                                    key={testimonial.id} 
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300 transform hover:translate-y-[-5px]"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex">{renderStars(testimonial.rating)}</div>
                                        <span className="text-gray-400 text-sm">{testimonial.date}</span>
                                    </div>
                                    
                                    <div className="relative mb-6">
                                        <Quote className="absolute top-0 left-0 text-yellow-200 h-8 w-8 -mt-1 -ml-2 opacity-50" />
                                        <p className="text-gray-600 pl-6 text-sm md:text-base leading-relaxed">
                                            {testimonial.comment}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-yellow-100">
                                            <img 
                                                src={testimonial.avatar} 
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <MapPin size={14} className="mr-1" />
                                                <p>{testimonial.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-center mt-6">
                            {[...Array(pageCount)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`h-2 w-2 rounded-full mx-1 ${
                                        currentPage === index ? 'bg-yellow-500' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Evaluate;