import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import { useData } from '../../Context/DataContext';



function Responsive({ isOpen, setIsOpen }) {
    const [openCategory, setOpenCategory] = useState(null); 

    const toggleCategory = (category) => {
        setOpenCategory((prev) => (prev === category ? null : category));
    };
    const {category, groupedBrands} = useData();
    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20"
                        onClick={() => setIsOpen(false)}
                    ></motion.div>
                    <motion.div
                        initial={{ x: '-100%' }}  // Bắt đầu từ bên trái màn hình
                        animate={{ x: 0 }}        // Di chuyển đến vị trí ban đầu
                        exit={{ x: '-100%' }}      // Khi thoát, di chuyển về bên trái màn hình
                        transition={{ duration: 0.5 }} // Thời gian chuyển tiếp
                        className="fixed top-0 left-0 w-[333px] h-full z-20 bg-white"
                    >
                        <div>
                            <div className='flex justify-between items-center p-4 bg-primary'>
                                <div className='font-bold font-serif text-xl'>
                                    Danh mục sản phẩm
                                </div>
                                <div>
                                    <MdClose onClick={() => setIsOpen(!isOpen)} className='text-2xl cursor-pointer' />
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[80vh]">
                                {category.length > 0 && 
                                    <div>
                                        {category.map(cate => (
                                            <div key={cate.id} className={`${openCategory === cate.category_name ? 'bg-gray-100' : ''}`}>
                                                <div className={`p-4 flex justify-between items-center border-t-2 cursor-pointer`} onClick={() => toggleCategory(cate.category_name)}>
                                                    <div>
                                                        <a href="#">{cate.category_name}</a>
                                                    </div>
                                                    <div>
                                                        {groupedBrands[cate.id]?.length > 0 && (
                                                            openCategory === cate.category_name ? <FaMinus /> : <FaPlus/>
                                                        )}
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    {openCategory === cate.category_name && (
                                                        <motion.ul
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className='border-b-1 border-gray-300'
                                                        >
                                                            <div className="pl-4">
                                                                {groupedBrands[cate.id] && groupedBrands[cate.id].length > 0 && (
                                                                    groupedBrands[cate.id].map((brand) => (
                                                                        <a key={brand.brand_id} href="#!" className="block text-gray-500 text-[15px] gap-2 hover:text-black ml-8">
                                                                            {brand.brand_name}
                                                                        </a>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Responsive;
