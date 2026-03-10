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

            <div>
                <div>
                    
                </div>
            </div>
        </div>
        </>
    );
}
export default Xanut;