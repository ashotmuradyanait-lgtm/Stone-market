import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listenUnreadCount } from "../firebase/chat";

// 1. Սահմանում ենք Props-ների տիպերը
interface HeaderProps {
  wishlistCount: number;
  currentUserUid: string | null | undefined; // Սա պետք է գա App.tsx-ից
}

const Header: React.FC<HeaderProps> = ({ wishlistCount, currentUserUid }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Եթե օգտատերը մուտք չի գործել, ոչինչ չենք անում
    if (!currentUserUid) {
      setUnreadCount(0);
      return;
    }

    // listenUnreadCount-ը վերադարձնում է unsubscribe ֆունկցիան
    const unsubscribe = listenUnreadCount(currentUserUid, (count: number) => {
      setUnreadCount(count);
    });

    // Մաքրում ենք լիսեները, երբ կոմպոնենտը ջնջվում է (unmount)
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUserUid]);

  return (
    <>
      {/* Վերևի սև շերտը */}
      <div className="bg-gray-800 text-white text-center py-1 text-xs">
        <a href="tel:+37443654777" className="hover:underline">
          Զանգահարել մեզ: +374 43 654 777
        </a>
      </div>

      {/* Հիմնական Header */}
      <div className="flex flex-col lg:flex-row p-4 lg:p-6 items-center justify-between bg-white shadow-sm sticky top-0 z-50">
        <Link to="/">
          <img
            className="mb-4 lg:mb-0 h-10"
            src="https://www.stonemarket.am/icons/logo-primary.svg"
            alt="logo"
          />
        </Link>

        {/* Մենյու */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-4 lg:mb-0">
          <Link to="/" className="font-bold text-gray-700 hover:text-indigo-600">Գլխավոր</Link>
          <Link to="/xanut" className="font-bold text-gray-700 hover:text-indigo-600">Խանութ</Link>
          <Link to="/design" className="font-bold text-gray-700 hover:text-indigo-600">Դիզայներներ</Link>
          <Link to="/mermasin" className="font-bold text-gray-700 hover:text-indigo-600">Մեր մասին</Link>
          <Link to="/kap" className="font-bold text-gray-700 hover:text-indigo-600">Կապ</Link>
          
          <Link to="/chat" className="relative font-bold text-indigo-600 flex items-center">
            Չատ
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-bounce">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* Աջակողմյան սրբապատկերներ */}
        <div className="flex gap-4 lg:gap-6 items-center">
          <i className="fa fa-search cursor-pointer text-gray-600 hover:text-black"></i>
          
          <Link to={currentUserUid ? `/profile/${currentUserUid}` : "/login"}>
             <i className="fa fa-user-circle cursor-pointer text-gray-600 hover:text-black text-xl"></i>
          </Link>

          {/* Wishlist Icon */}
          <Link to="/like" className="relative">
            <i className="fa fa-heart text-xl text-red-500"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <div className="relative cursor-pointer group">
            <i className="fa fa-shopping-cart text-gray-600 group-hover:text-black text-xl"></i>
          </div>

          <img
            className="h-4 w-6 rounded-sm shadow-sm cursor-pointer"
            src="https://www.stonemarket.am/icons/hy.svg"
            alt="lang"
          />
        </div>
      </div>
    </>
  );
}

export default Header;