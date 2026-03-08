import React from "react";

function Footer(){
    return(
        <>
       <div className="bg-gray-900 min-h-screen w-full p-4 lg:p-10">

  <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">

    <div className="border border-white w-full lg:w-[500px] rounded-lg p-6">
      <p className="text-white font-bold text-2xl mb-2">Հետադարձ կապ</p>

      <p className="text-white text-sm mb-4">
        Լրացրեք տվյալները և մենք կկապնվենք Ձեզ հետ հնարավորինս շուտ։
      </p>

      <div className="flex flex-col gap-3">
        <input className="text-white bg-gray-800 w-full h-[35px] rounded-lg px-2" type="text" placeholder="Անուն" />
        <input className="text-white bg-gray-800 w-full h-[35px] rounded-lg px-2" type="text" placeholder="Էլ․հասցե" />
        <input className="text-white bg-gray-800 w-full h-[35px] rounded-lg px-2" type="number" placeholder="+374" />
        <input className="text-white bg-gray-800 w-full h-[35px] rounded-lg px-2" type="text" placeholder="Կազմակերպություն" />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox"/>
        <p className="text-white text-sm">Համաձայն եմ կայքի պայմաններին</p>
      </div>

      <div className="flex justify-center mt-6">
        <button className="text-white bg-green-400 h-[40px] w-[120px] rounded-lg hover:bg-green-600">
          Ուղարկել
        </button>
      </div>
    </div>

    <img
      className="w-full lg:w-[900px] h-[300px] lg:h-[400px] object-cover rounded-lg"
      src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Ffeedback.webp&w=1920&q=75"
      alt=""
    />

  </div>

  <div className="border-t border-white mt-10"></div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 p-6">

    <div>
      <img className="mb-4" src="https://www.stonemarket.am/icons/logo-light.svg" alt="" />
      <p className="text-white">+374 (33) 76 - 73 - 77</p>
      <p className="text-white text-sm">sstonemarket@yandex.ru</p>
    </div>

    <div className="text-white text-sm space-y-2">
      <p>Գլխավոր</p>
      <p>Խանութ</p>
      <p>Դիզայներներ</p>
      <p>Մեր մասին</p>
      <p>Կապ</p>
      <p>Գաղտնիության քաղաքականություն</p>
      <p>Ընդհանուր դրույթներ և պայմաններ</p>
      <p>Հաշվի ջնջում</p>
    </div>

    <div className="text-white text-sm space-y-2">
      <p>Ծառայություններ</p>
      <p>Արտադրական ցիկլի աուդիտ</p>
      <p>Հանքաքարի շահագործման ծառայություն</p>
      <p>Ֆոտո/վիդեո բռենդ փաթեթավորում</p>
      <p>Export-ի կազմակերպում</p>
      <p>Բեռնափոխադրում</p>
    </div>

    <div className="text-white text-sm space-y-2">
      <p>Հետևե՜ք մեզ սոցցանցերում</p>
      <div></div>
      <img src="https://www.stonemarket.am/icons/instagram.svg" alt="" />
      <p>stonemarket.am</p>
      <p>Stone Market</p>
    </div>

  </div>

  <div className="flex flex-col md:flex-row items-center justify-center gap-4 pb-10">
    <p className="text-white text-sm">Ներբեռնեք մեր հավելվածը</p>

    <img src="https://www.stonemarket.am/icons/app-store.svg" alt="" />
    <img src="https://www.stonemarket.am/icons/google-play.svg" alt="" />
  </div>

</div>
        </>
    );
}
export default Footer;