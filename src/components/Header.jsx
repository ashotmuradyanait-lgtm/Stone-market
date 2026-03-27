import { Link } from "react-router-dom";

function Header({ wishlistCount, unreadMessages }) {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:gap-70 p-4 lg:p-6 items-center lg:items-start justify-between">
        <img
          className="mb-4 lg:mb-0"
          src="https://www.stonemarket.am/icons/logo-primary.svg"
          alt="logo"
        />

        <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-4 lg:mb-0">
          <Link to="/" className="font-GHEAGrpalatReg font-bold">Գլխավոր</Link>
          <Link to="/xanut" className="font-GHEAGrpalatReg font-bold">Խանութ</Link>
          <Link to="/design" className="font-GHEAGrpalatReg font-bold">Դիզայներներ</Link>
          <Link to="/mermasin" className="font-GHEAGrpalatReg font-bold">Մեր մասին</Link>
          <Link to="/kap" className="font-GHEAGrpalatReg font-bold">Կապ</Link>

          <Link to="/login" className="relative font-GHEAGrpalatReg font-bold text-blue-500">
            Login
            {unreadMessages > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {unreadMessages}
              </span>
            )}
          </Link>
        </div>

        <div className="flex gap-4 lg:gap-6 items-center">
          <i className="fa fa-search cursor-pointer"></i>
          <i className="fa fa-sign-out cursor-pointer"></i>

          <Link to="/like" className="relative">
            <i className="fa fa-heart text-xl"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <i className="fa fa-shopping-cart cursor-pointer"></i>

          <img
            className="h-[16px] w-[16px]"
            src="https://www.stonemarket.am/icons/hy.svg"
            alt="lang"
          />
        </div>
      </div>
    </>
  );
}

export default Header;