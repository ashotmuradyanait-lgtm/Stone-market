import React from 'react';
import { Link } from 'react-router-dom';

function Like({ wishlist, onLike }) {
    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            <div className="flex px-14 gap-2 pt-4 items-center">
                <Link to="/" className="text-gray-500 text-[14px]">Գլխավոր</Link>
                <img src="https://www.stonemarket.am/icons/arrow-right-black.svg" className="h-3" alt="" />
                <p className="text-gray-700 text-[14px]">Հավանածներ</p>
            </div>

            <div className="px-14 py-8">
                <h1 className="text-2xl font-bold mb-6">Իմ հավանած ապրանքները ({wishlist.length})</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <i className="fa fa-heart-o text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500 text-lg">Ձեր հավանածների ցուցակը դատարկ է։</p>
                        <Link to="/xanut" className="text-green-600 font-semibold mt-4 inline-block hover:underline">
                            Գնալ խանութ →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                        {wishlist.map((item, index) => (
                            <div key={index} className="bg-white h-[380px] w-[300px] rounded-[20px] shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                <div className="relative h-[220px] p-2">
                                    <img 
                                        className="h-full w-full object-contain rounded-t-lg" 
                                        src={`https://www.stonemarket.am/_next/image?url=${encodeURIComponent(item.img)}&w=1920&q=75`} 
                                        alt={item.name} 
                                    />
                                    <button 
                                        onClick={() => onLike(item)}
                                        className="bg-red-500 h-[38px] w-[38px] p-2 rounded-lg absolute bottom-2 right-4 shadow-sm hover:bg-red-600 transition-colors"
                                    >
                                        <img src="https://www.stonemarket.am/icons/like-white.svg" alt="remove" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <p className="font-semibold text-sm truncate">{item.name}</p>
                                    <p className="text-[12px] text-gray-500 h-[32px] overflow-hidden mt-1 leading-tight">
                                        {item.desc}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="font-bold text-[17px] text-gray-900">{item.price}</p>
                                        <button className="border border-green-500 h-[34px] w-[34px] p-2 rounded-lg hover:bg-green-50 transition-colors">
                                            <img src="https://www.stonemarket.am/icons/add-to-cart-black.svg" alt="cart" />
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
}

export default Like;