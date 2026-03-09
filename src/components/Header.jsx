import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
        <div className="flex flex-col lg:flex-row lg:gap-70 p-4 lg:p-6 items-center lg:items-start">

  <img 
    className="mb-4 lg:mb-0"
    src="https://www.stonemarket.am/icons/logo-primary.svg" 
    alt="" 
  />

  <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-4 lg:mb-0">
    <Link to="/" className="font-GHEAGrpalatReg font-bold">Գլխավոր</Link>
    <p className="font-GHEAGrpalatReg font-bold">Խանութ</p>
    <Link to="/design" className="font-GHEAGrpalatReg font-bold">Դիզայներներ</Link>
    <Link to="/mermasin" className="font-GHEAGrpalatReg font-bold">Մեր մասին</Link>
    <Link to="/kap" className="font-GHEAGrpalatReg font-bold">Կապ</Link>
  </div>

  <div className="flex gap-4 lg:gap-6">
    <i className="fa fa-search"></i>
    <i className="fa fa-sign-out"></i>
    <i className="fa fa-heart"></i>
    <i className="fa fa-shopping-cart"></i>

    <img 
      className="h-[16px] w-[16px]" 
      src="https://www.stonemarket.am/icons/hy.svg" 
      alt="" 
    />
  </div>

</div>
    </>
  );
}   

export default Header;