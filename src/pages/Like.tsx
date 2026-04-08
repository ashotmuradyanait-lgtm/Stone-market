import React from 'react';
import { Link } from 'react-router-dom';

// 1. Սահմանում ենք ապրանքի տիպը (price-ը դարձնում ենք միայն string)
interface Product {
    name: string;
    img: string;
    desc: string;
    price: string; 
}

// 2. Սահմանում ենք Props-ների տիպերը
interface LikeProps {
    wishlist: Product[];
    onLike: (product: Product) => void;
}

const Like: React.FC<LikeProps> = ({ wishlist, onLike }) => {
    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="flex px-14 gap-2 pt-4 items-center">
                <Link to="/" className="text-gray-500 text-[14px] hover:text-green-600 transition-colors">Գլխավոր</Link>
                <img src="https://www.stonemarket.am/icons/arrow-right-black.svg" className="h-3" alt="arrow" />
                <p className="text-gray-700 text-[14px]">Հավանածներ</p>
            </div>

            <div className="px-14 py-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Իմ հավանած ապրանքները ({wishlist.length})</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="mb-4">
                             <i className="fa fa-heart-o text-5xl text-gray-300"></i>
                        </div>
                        <p className="text-gray-500 text-lg">Այս պահին ավելացված նախընտրած ապրանքներ չկան</p>
                        <Link to="/xanut" className="text-green-600 font-semibold mt-4 inline-block hover:underline">
                            Գնալ խանութ →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                        {wishlist.map((item, index) => (
                            <div key={index} className="bg-white h-[380px] w-[300px] rounded-[20px] shadow-sm relative overflow-hidden transition-all hover:shadow-xl group">
                                <div className="relative h-[220px] p-2 overflow-hidden">
                                    <img 
                                        className="h-full w-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-110" 
                                        src={`https://www.stonemarket.am/_next/image?url=${encodeURIComponent(item.img)}&w=1920&q=75`} 
                                        alt={item.name} 
                                    />
                                    <button 
                                        onClick={() => onLike(item)}
                                        className="bg-red-500 h-[38px] w-[38px] p-2 rounded-lg absolute bottom-2 right-4 shadow-md hover:bg-red-600 transition-all transform hover:scale-110 z-10"
                                        title="Հեռացնել"
                                    >
                                        <img src="https://www.stonemarket.am/icons/like-white.svg" alt="remove" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                                    <p className="text-[12px] text-gray-500 h-[32px] overflow-hidden mt-1 leading-tight italic">
                                        {item.desc}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="font-black text-[17px] text-indigo-900">{item.price}</p>
                                        <button className="border border-green-500 h-[36px] w-[36px] p-2 rounded-lg hover:bg-green-500 group/cart transition-colors">
                                            <img 
                                                className="w-full h-full group-hover/cart:brightness-0 group-hover/cart:invert transition-all" 
                                                src="https://www.stonemarket.am/icons/add-to-cart-black.svg" 
                                                alt="cart" 
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Like;