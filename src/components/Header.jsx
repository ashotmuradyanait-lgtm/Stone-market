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
        <div className="bg-yellow-50 h-[550px] w-[350px] rounded-lg"> 
            <div className="flex p-4">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fnatural-stones.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Բնական քար</p>
            </div>
            <div className="flex p-4">
                <img className="h-[54px] w-[54px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fnatural-stones.png&w=128&q=75" alt="" />
                <p className="p-2 font-semibold">Բնական քար</p>
            </div>
        </div>
    </>
  );
}   

export default Header;