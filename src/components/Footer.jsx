import React from "react";

function Footer(){
    return(
        <>
        <div className="bg-gray-900 h-[800px] w-[1520px]">
            <div className="flex gap-6">
            <div className="з-4 border border-white h-[400px] w-[500px] rounded-lg">
                <p className="text-white font-bold text-2xl p-4">Հետադարձ կապ</p>
                <p className="text-white text-sm">Լրացրեք տվյալները և մենք կկապնվենք Ձեզ հետ հնարավորինս <br />
                 շուտ։</p>
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="text" placeholder="Անուն" />
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="text" placeholder="Էլ․հասցե" />
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="number" placeholder="+374" />
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="text" placeholder="Կազմակերպություն" />
                 <br />
                 <span className="text-white">Համաձայն եմ կայքի պայմաններին</span>
             <div className="justify-center flex p-20">
                <p className="text-white bg-green-400 h-[40px] text-center w-[100px] rounded-lg mx-auto hover:bg-green-600 ">Ուղարկել</p>
        </div>
            </div>
             <img className="h-[400px] w-[900px] rounded-lg" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Ffeedback.webp&w=1920&q=75" alt="" />
            </div>
            <p className="p-4 border-white border w-[1520px]"></p>
            <img src="https://www.stonemarket.am/icons/logo-light.svg" alt="" />
        </div>
        </>
    );
}
export default Footer;