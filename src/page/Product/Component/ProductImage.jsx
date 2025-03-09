import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { src } from "../../../Api";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function ProductShowImage({product})
{
    const [displayedImage, setDisplayedImage] = useState(product.images);
    const [descriptionImages, setDescriptionImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleThumbnailClick = (image, index) => {
        setDisplayedImage(image);
        setCurrentIndex(index);
    };  

    useEffect(() => {
        if (product.description_image && product.description_image.length > 0) {
            try {
                const parsedImages = JSON.parse(product.description_image);
                setDescriptionImages(parsedImages);
            } catch (error) {
                console.error("Error parsing description image:", error);
            }
        }
    }, [product.description_image]);
    useEffect(() => {
        // tất cả ảnh
        const allImages = [product.images, ...descriptionImages];

        const interval = setInterval(() => {
            // Chuyển sang ảnh tiếp theo
            const nextIndex = (currentIndex + 1) % allImages.length;
            setDisplayedImage(allImages[nextIndex]);
            setCurrentIndex(nextIndex);
        }, 5000); 

        return () => clearInterval(interval);
    }, [currentIndex, descriptionImages, product.images]);
    const handleNextImg = () => {
        const allImages = [product.images, ...descriptionImages];
        const nextIndex = (currentIndex + 1) % allImages.length;
        setDisplayedImage(allImages[nextIndex]);
        setCurrentIndex(nextIndex);
    }
    const handlePrevImg = () => {
        const allImages = [product.images, ...descriptionImages];
        const nextIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        setDisplayedImage(allImages[nextIndex]);
        setCurrentIndex(nextIndex);
    }
    return (
        <div>
            <div className="h-full">
                <div className="flex items-center justify-center mb-4 relative">
                    <button 
                        className="absolute left-4 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition transform hover:scale-110 active:scale-90"
                        onClick={handlePrevImg}
                    >
                        <IoIosArrowBack   className="text-2xl" />
                    </button>
                    {/* Hình ảnh có animation */}
                    <motion.img
                        key={displayedImage}
                        src={src + `${
                            descriptionImages.includes(displayedImage)
                                ? `imgDescriptionProduct/${displayedImage}`
                                : `imgProduct/${displayedImage}`
                        }`}
                        alt={product.product_name}
                        className="max-w-full h-[500px] object-contain"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                    />
                    <button 
                        className="absolute right-4 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition transform hover:scale-110 active:scale-90"
                        onClick={handleNextImg}
                    >
                        <IoIosArrowForward className="text-2xl" />
                    </button>
                </div>
                <div className="w-full">
                    <div 
                        className="flex space-x-2 overflow-x-auto scrollbar-hide py-2"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none'
                        }}
                    >
                        {/* Main product image */}
                        {/* <div
                            onClick={() => handleThumbnailClick(product.images, 0)}
                            className={`flex-shrink-0 w-12 sm:w-16 md:w-20 lg:w-24 cursor-pointer rounded-lg overflow-hidden ml-2 ${
                                displayedImage === product.images
                                    ? 'ring-2 ring-blue-500'
                                    : 'ring-1 ring-gray-200 hover:ring-blue-300'
                            }`}
                        >
                            <img
                                src={src + `imgProduct/${product.images}`}
                                alt={product.product_name}
                                className="w-full h-full aspect-square object-cover"
                            />
                        </div> */}

                        {/* Description images */}
                        {/* {descriptionImages.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => handleThumbnailClick(image.trim(), index + 1)}
                                className={`flex-shrink-0 w-12 sm:w-16 md:w-20 lg:w-24 cursor-pointer rounded-lg overflow-hidden ${
                                    displayedImage === image.trim()
                                        ? 'ring-2 ring-blue-500'
                                        : 'ring-1 ring-gray-200 hover:ring-blue-300'
                                }`}
                            >
                                <img
                                    src={src + `imgDescriptionProduct/${image.trim()}`}
                                    alt={`${product.product_name} description ${index + 1}`}
                                    className="w-full h-full aspect-square object-cover"
                                />
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductShowImage