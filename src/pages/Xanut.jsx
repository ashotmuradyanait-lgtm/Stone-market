import React from "react";

function Xanut(){
    return(
        <>
        <div className="bg-gray-100 w-full h-full">
            <div className="flex px-14 gap-2">
            <p className="text-gray text-[14px]">Գլխավոր</p>
            <img src="https://www.stonemarket.am/icons/arrow-right-black.svg" alt="" />
            <p className="text-gray text-[14px]">Խանութ</p>
            </div>
            <div className="px-14 p-8 flex gap-2">
                <p className="font-semibold">Կատեգորիա:</p>
                <p className="border border-gray rounded-lg h-[35px] w-[200px] text-center hover:border-green-500  ">Բնական քար</p>
                <p className="border border-gray rounded-lg h-[35px] w-[200px] text-center hover:border-green-500  ">Արհեստական քար</p>
                <p className="border border-gray rounded-lg h-[35px] w-[130px] text-center hover:border-green-500  ">Հաստոցներ</p>
                <p className="border border-gray rounded-lg h-[35px] w-[500px] text-center hover:border-green-500  ">Քարամշակման գործիքներ և պարագաներ</p>
                <p className="border border-gray rounded-lg h-[35px] w-[250px] text-center hover:border-green-500  ">Քիմիական նյութեր</p>
                <p className="border border-gray rounded-lg h-[35px] w-[400px] text-center hover:border-green-500  ">Արտադրական Ծառայություններ</p>
            </div>
            <div className="px-42">
            <p className="border border-gray rounded-lg h-[35px] w-[130px] text-center hover:border-green-500 ">Mane Tiles</p>
            </div>

            <div className="flex justify-center">
                <div className="bg-[#ffffff] h-[350px] w-[350px] rounded-[20px]">
                    <img className="h-[200px] w-[320px] rounded-lg mx-auto" src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N073-1--1772700511503.webp&w=1920&q=75" alt="" />
                    <p className="font-semibold p-2 px-4">Բետոնե Սեղան N073</p>
                    <p className="px-4 text-[15px]">Սեղան բետոնից՝ յուրահատուկ և <br />
                     արտահայտիչ դիզայնով։...</p>
                     <p className="font-semibold px-4 pt-7 text-[20px]">600,000Դր.</p>
                     <i className="border border-green h-[30px] w-[30px]" class="fa fa-cart-plus" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        </>
    );
}
export default Xanut;