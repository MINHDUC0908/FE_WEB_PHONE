import { useEffect, useState } from "react"
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";


function Top()
{
    const [showGoToTop, setShowgoToTop] = useState(false)
    useEffect(() => {
        const handScroll = () => {
            if (window.scrollY >= 200)
            {
                setShowgoToTop(true);
            } else {
                setShowgoToTop(false);
            }
        }
        window.addEventListener('scroll', handScroll);
        return () => {
            window.removeEventListener('scroll', handScroll);
            console.log('remove')
        }
    }, []);
    const top = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    return (
        <div>
            {showGoToTop && (
                <button
                    onClick={top}
                    className="hidden fixed w-12 h-12 lg:h-14 lg:w-14 lg:flex items-center justify-center text-center bg-gray-100 bottom-20 lg:bottom-5 right-1 lg:right-10 rounded-full"
                >
                    <MdOutlineKeyboardDoubleArrowUp size={25} className=""/>
                </button>
            )}
        </div>
    )
}
export default Top