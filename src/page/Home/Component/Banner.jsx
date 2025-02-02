import bn1 from '../../../assets/banner/bn1.jpg';
import bn2 from '../../../assets/banner/bn2.jpg';
import bn3 from '../../../assets/banner/bn3.jpg';

const banners = [
    {
        id: 1,
        img: bn1,
        title: "Experience with best smartphone on the world",
        name: "Iphone 6+ 32Gb",
        sale: "30% OFF"
    },
    {
        id: 2,
        img: bn2,
        title: "100% leather handmade",
        name: "Unio Leather Bags",
        sale: "20% OFF"
    },
    {
        id: 3,
        img: bn3,
        title: "Includes blender, cup, etc",
        name: "Nutrillet Blender Combo",
        sale: "40% OFF"
    },
];

function Banner() {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
                banners.map((banner) => {
                    return (
                        <div key={banner.id} className='relative overflow-hidden shadow-lg bg-white transition-transform duration-300 lg:mb-10'>
                            <img src={banner.img} alt={banner.name} className='w-full h-48 object-cover rounded-t-lg' />
                            <div className='absolute inset-0 border border-[#D3D3D3] bg-opacity-30 flex flex-col justify-between p-4'>
                                <div>
                                    <h2 className='text-lg font-bold'>{banner.name}</h2>
                                    <p className='text-[12px] overflow-hidden text-ellipsis'>
                                        {banner.title}
                                    </p>
                                </div>
                                <p className='text-sm bg-yellow-500 px-3 py-1 rounded-full mt-2 self-start'>{banner.sale}</p>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default Banner;
