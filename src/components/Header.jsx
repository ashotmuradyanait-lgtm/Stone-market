import React from "react";

function Header() {
  return (
    <>
        <div className="flex flex-col lg:flex-row lg:gap-60 p-4 lg:p-6 items-center lg:items-start">

  <img 
    className="mb-4 lg:mb-0"
    src="https://www.stonemarket.am/icons/logo-primary.svg" 
    alt="" 
  />

  <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-4 lg:mb-0">
    <p className="font-GHEAGrpalatReg font-bold">Գլխավոր</p>
    <p className="font-GHEAGrpalatReg font-bold">Խանութ</p>
    <p className="font-GHEAGrpalatReg font-bold">Դիզայներներ</p>
    <p className="font-GHEAGrpalatReg font-bold">Մեր մասին</p>
    <p className="font-GHEAGrpalatReg font-bold">Կապ</p>
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