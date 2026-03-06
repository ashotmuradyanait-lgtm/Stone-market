import React from "react";

function Header() {
  return (
    <>
        <div className= "flex gap-60 p-6">
            <img src="https://www.stonemarket.am/icons/logo-primary.svg" alt="" />
            <div className="justify-between flex gap-8">
                <p className="font-GHEAGrpalatReg font-bold">Գլխավոր</p>
                <p className="font-GHEAGrpalatReg font-bold">Խանութ</p>
                <p className="font-GHEAGrpalatReg font-bold">Դիզայներներ</p>
                <p className="font-GHEAGrpalatReg font-bold">Մեր մասին</p>
                <p className="font-GHEAGrpalatReg font-bold">Կապ</p>
            </div>
            <div className="flex gap-6">
                <i class="fa fa-search" aria-hidden="true"></i>
                <i class="fa fa-sign-out" aria-hidden="true"></i>
               <i class="fa fa-heart" aria-hidden="true"></i>
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                <img className="h-[16px] w-[16px]" src="https://www.stonemarket.am/icons/hy.svg" alt="" />
            </div>
        </div>
    <div className="flex gap-20">
        <div className="bg-yellow-50 h-[550px] w-[350px] rounded-lg"> 
            <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fnatural-stones.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Բնական քար</p>
            </div>
            <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Ftiles-and-slabs.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Արհեստական քար</p>
            </div>
             <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Findoor-products.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Հաստոցներ</p>
            </div>
            <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fsinks-washbasins.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Քարամշակման գործիքներ և <br />
                պարագաներ
                </p>
            </div>
            <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fdecorative-items.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Քիմիական նյութեր</p>
            </div>
            <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fcustom-products.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Արտադրական <br />
                ծառայություններ
                </p>
            </div>
            <div className="flex p-2">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fmane-tiles-logo.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Mane Tiles</p>
            </div>
        </div>
        <div>
             <video className="w-[900px] h-[550px] rounded-lg shadow-lg" src="blob:https://www.stonemarket.am/25229997-e22e-4d64-85cc-8b5a93084c7b" controls muted autoPlay loop/>
        </div>
    </div>
    </>
  );
}   

export default Header;