import img1 from '../../../assets/banner/img1.jpg';
import img2 from '../../../assets/banner/img2.jpg';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button 
            className="custom-prev-arrow absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-300 shadow-lg hover:bg-gray-400 text-gray-700 p-3 focus:outline-none transition-all duration-200 ease-in-out hidden xl:block"
            style={{ zIndex: 1000 }} 
            onClick={onClick} 
        >
            <FaChevronLeft size={20} />
        </button>
    );
}

function NextArrow(props) {
    const { onClick } = props;
    return (
        <button 
            className="custom-next-arrow absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-300 shadow-lg hover:bg-gray-400 text-gray-700 p-3 focus:outline-none transition-all duration-200 ease-in-out hidden xl:block"
            style={{ zIndex: 1000 }} 
            onClick={onClick} 
        >
            <FaChevronRight size={20} />
        </button>
    );
}
function Hero() {
    const banner = [
        {
            id: 1,
            title: 'Máy tính hàng đầu Chất lượng',
            discount: '40%',
            superPromotion: 'Siêu khuyến mãi',
            button: 'Mua ngay',
            img: img1,
        },
        {
            id: 2,
            title: 'Sản phẩm giới hạn Tuyệt vời',
            discount: '30% Off',
            superPromotion: 'Đừng bỏ lỡ',
            button: 'Mua ngay',
            img: img2,
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        arrows: true,
        prevArrow: <PrevArrow />,  
        nextArrow: <NextArrow />, 
    };

    return (
        <div className="py-10 xl:p-14 relative" data-aos="zoom-in" data-aos-delay="300">
            <Slider {...settings}>
                {banner.map((item) => (
                    <div key={item.id} className="relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 justify-center">
                            <div className="flex flex-col justify-center items-start sm:ml-10 xl:ml-52">
                                <p className="text-[#FF0000] mb-5">
                                    {item.superPromotion}
                                </p>
                                <h1 className="text-3xl mr-10 sm:mr-0 sm:text-4xl mb-5 font-sans font-semibold">
                                    {item.title}
                                </h1>
                                <p data-aos="fade-up" className="mb-5">
                                    Discount: <br /><span className='text-[#669900] text-xl sm:text-2xl lg:text-3xl'>{item.discount}</span>
                                </p>
                                <div>
                                    <button data-aos="fade-up" data-aos-delay="300" className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-black py-2 px-5 font-semibold">
                                        {item.button}
                                    </button>
                                </div>
                            </div>
                            <div className='hidden sm:block mt-5'>
                                <img
                                    src={item.img}
                                    className="h-52 w-52 object-cover rounded-full sm:ml-32 ml-56 xl:ml-40"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Hero;
