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


<div className="flex flex-col lg:flex-row gap-6 lg:gap-20 p-4">

  <div className="bg-yellow-50 w-full lg:w-[350px] rounded-lg p-2">

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fnatural-stones.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">Բնական քար</p>
    </div>

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Ftiles-and-slabs.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">Արհեստական քար</p>
    </div>

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Findoor-products.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">Հաստոցներ</p>
    </div>

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fsinks-washbasins.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">
        Քարամշակման գործիքներ և <br/> պարագաներ
      </p>
    </div>

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fdecorative-items.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">Քիմիական նյութեր</p>
    </div>

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fcustom-products.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">
        Արտադրական <br/> ծառայություններ
      </p>
    </div>

    <div className="flex p-2 items-center">
      <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fmane-tiles-logo.png&w=128&q=75" alt="" />
      <p className="p-2 font-semibold">Mane Tiles</p>
    </div>

  </div>


  <div className="w-full">
    <video 
      className="w-full lg:w-[900px] h-[300px] lg:h-[550px] rounded-lg shadow-lg"
      controls
      muted
      autoPlay
      loop
    />
  </div>

</div>
    </>
  );
}   

export default Header;