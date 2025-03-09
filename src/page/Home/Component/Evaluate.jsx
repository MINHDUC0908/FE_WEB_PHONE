import React from 'react';
import anh1 from "../../../assets/evaluate/1.png"
import anh2 from "../../../assets/evaluate/2.png"
import anh3 from "../../../assets/evaluate/3.png"
import anh4 from "../../../assets/evaluate/4.png"
import { Link } from 'react-router-dom';
function Evaluate() {
    const testimonials = [
        {
            id: 1,
            name: 'Trần Văn Anh',
            location: 'Hồ Chí Minh',
            comment: 'Dịch vụ khách hàng cũng rất tuyệt vời, nhân viên nhiệt tình và chuyên nghiệp. Tôi chắc chắn sẽ quay lại cửa hàng này cho các nhu cầu điện tử của tôi.',
            avatar: anh1,
            rating: 5
        },
        {
            id: 2,
            name: 'Nguyễn Thị Hương',
            location: 'Hà Nội',
            comment: 'Dịch vụ khách hàng cũng rất tuyệt vời, nhân viên nhiệt tình và chuyên nghiệp. Tôi chắc chắn sẽ quay lại cửa hàng này cho các nhu cầu điện tử của tôi.',
            avatar: anh2,
            rating: 5
        },
        {
            id: 3,
            name: 'Phương Ly',
            location: 'Hải Phòng',
            comment: 'Dịch vụ khách hàng cũng rất tuyệt vời, nhân viên nhiệt tình và chuyên nghiệp. Tôi chắc chắn sẽ quay lại cửa hàng này cho các nhu cầu điện tử của tôi.',
            avatar: anh3,
            rating: 5
        },
        {
            id: 4,
            name: 'Cristiano Ronaldo',
            location: 'Bồ Đào Nha',
            comment: 'Dịch vụ khách hàng cũng rất tuyệt vời, nhân viên nhiệt tình và chuyên nghiệp. Tôi chắc chắn sẽ quay lại cửa hàng này cho các nhu cầu điện tử của tôi.',
            avatar: anh4,
            rating: 5
        }
    ];


    const renderStars = (rating) => {
        const stars = [];
            for (let i = 0; i < 5; i++) {
            stars.push(
                <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Khách hàng nói gì về chúng tôi</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Chúng tôi luôn lắng nghe ý kiến từ khách hàng để không ngừng cải thiện chất lượng dịch vụ và sản phẩm</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 rounded-2xl overflow-hidden bg-yellow-500 relative h-full min-h-[400px] lg:min-h-[600px] shadow-lg">
                        <div className="absolute inset-0">
                            <img 
                                src={anh4} 
                                alt="Satisfied customer" 
                                className="w-full h-full object-cover transition duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 opacity-60"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-8 text-center max-w-lg">
                                <h3 className="text-white text-3xl font-extrabold mb-4 drop-shadow-lg">Trải nghiệm mua sắm tuyệt vời</h3>
                                <p className="text-white text-lg mb-6 drop-shadow-md">Hơn <span className="font-bold">50,000+</span> khách hàng hài lòng với dịch vụ của chúng tôi</p>
                                <button className="bg-white text-yellow-600 font-semibold py-2 px-8 rounded-full shadow-md hover:bg-yellow-50 transition duration-300 transform hover:scale-105">
                                    <Link to={"product"}>
                                        Mua sắm ngay
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
                                <div className="flex items-center mb-4">
                                    {renderStars(testimonial.rating)}
                                </div>
                                    <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">"{testimonial.comment}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                                        <p className="text-gray-500 text-sm">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Evaluate;