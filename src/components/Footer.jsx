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
        <div className="flex gap-20 p-6">
        <div>
            <img className="p-4" src="https://www.stonemarket.am/icons/logo-light.svg" alt="" />
            <p className="text-white">+374 (33) 76 - 73 - 77</p>
            <h6 className="text-white text-sm">sstonemarket@yandex.ru</h6>
        </div>
        <div>
            <p className="text-sm text-white">Գլխավոր</p>
            <p className="text-sm text-white">Խանութ</p>
            <p className="text-sm text-white">Դիզայներներ</p>
            <p className="text-sm text-white">Մեր մասին</p>
            <p className="text-sm text-white">Կապ</p>
            <p className="text-sm text-white">Գաղտնիության քաղաքականություն</p>
            <p className="text-sm text-white">Ընդհանուր դրույթներ և պայմաններ</p>
            <p className="text-sm text-white">Հաշվի ջնջում</p>
        </div>
        <div>
            <p className="text-sm text-white">Ծառայություններ</p>
            <p className="text-sm text-white">Արտադրական ցիկլի աուդիտ</p>
            <p className="text-sm text-white">Հանքաքարի շահագործման ծառայություն</p>
            <p className="text-sm text-white">Ֆոտո/վիդեո բռենդ փաթեթավորում</p>
            <p className="text-sm text-white">Export-ի կազմակերպում</p>
            <p className="text-sm text-white">Բեռնափոխադրում</p>
        </div>
          <div>
            <p className="text-sm text-white">Հետևե՜ք մեզ սոցցանցերում</p>
            <i className="text-sm" class="fa fa-instagram" aria-hidden="true">stonemarket.am</i>
            <i className="rounded-full" class="fa fa-facebook-official" aria-hidden="true">Stone Market</i>
        </div>
        </div>
        <div className="flex justify-center">
        <p className="p-10 text-white text-sm text-center">Ներբեռնեք մեր հավելվածը</p>
        <img src="https://www.stonemarket.am/icons/app-store.svg" alt="" />
        <img src="https://www.stonemarket.am/icons/google-play.svg" alt="" />
        </div>
        </div>
        </>
    );
}
export default Footer;