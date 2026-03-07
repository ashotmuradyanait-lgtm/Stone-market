import React from "react";


function Home() {
  return (
    <>
 <div className="p-6 lg:p-20">
  <img 
    className="w-full"
    src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Frocket-line.jpg&w=1920&q=75" 
    alt="" 
  />
</div>

<div>
  <h1 className="text-center font-bold font-serif text-2xl lg:text-3xl">
    Մեր Գործընկերները
  </h1>

  <p className="text-center p-4 lg:p-6 text-sm lg:text-base">
    Մեր գործընկերները ներկայացնում են բարձրորակ քարեր և կոպեր, որոնք առաջարկում են նորարարական լուծումներ: <br/>
    Յուրաքանչյուր գործընկեր կարևոր է մեր առաքելության համար՝ ստեղծել գեղեցիկ միջավայրեր, որտեղ քարերը պատմում են <br/>
    իրենց պատմությունները:
  </p>
</div>


<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-16 justify-items-center p-6">

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fpetro-stone.png&w=1920&q=75" alt="" />
    <a href="https://petro-stone.am/" className="block mt-2">Petro Stone Armenia</a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fag-impex.png&w=1920&q=75" alt="" />
    <a href="https://www.agimpex.am/hy" className="block mt-2">AG Impex</a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fstone-world.png&w=1920&q=75" alt="" />
    <a href="https://stoneworld.am/pages/good-list.php?lang=en" className="block mt-2">
      Stone World Armenia
    </a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fqaramshak.png&w=1920&q=75" alt="" />
    <a href="https://www.instagram.com/qaramshaak/" className="block mt-2">
      Qaramshak
    </a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fstone-park.png&w=1920&q=75" alt="" />
    <a href="https://www.armstone.am/" className="block mt-2">
      Stone Park
    </a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fmane-tiles.png&w=1920&q=75" alt="" />
    <a href="https://manetiles.com/" className="block mt-2">
      Mane Tiles
    </a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Farmenian-stone-studio.png&w=1920&q=75" alt="" />
    <a href="https://www.facebook.com/MFScompany/" className="block mt-2">
      Armenian Stone Studio
    </a>
  </div>

  <div className="text-center">
    <img className="w-[120px] lg:w-[150px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fdadoyan-wood.png&w=1920&q=75" alt="" />
    <a href="https://www.instagram.com/dadoyan_wood/" className="block mt-2">
      Dadoyan Wood
    </a>
  </div>
</div>
<div>
  <h1 className="text-center p-4 text-3xl font-semibold">Դիզայներներ</h1>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740466806085--Messenger_creation_4D4BF230-75CC-4580-A6C6-5B77D4AED49E.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">Unique Design</p>
    <p className="text-sm">Ճարտարապետական ​​3D մոդելների <br /> մշակում ըստ ձեր գծագրերի և էսքիզների...</p>
  </div>

  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739358817839--WhatsApp_Image_2025-02-12_at_15.01.36_b320a8a6.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">ARCHITECTUM LLC</p>
    <p className="text-sm">1. Էսքիզային նախագծերի մշակում, <br /> ցուցադրական նյութերի պատրաստում...</p>
  </div>

  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739528262438--WhatsApp_Image_2025-02-14_at_13.51.57_73d0dfcd.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">LUMINAR studio</p>
    <p className="text-sm">Նախագծման ընթացքում մեր փորձառու <br /> մասնագետները կիրառում են միմիայն...</p>
  </div>

  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743664023548--photo_2025-04-03_11-05-29.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">SILAS DESIGN AND CONSTRUCTION</p>
    <p className="text-sm">SILAS DESIGN AND CONSTRUCTION <br /> հիմնադրվել է 2010 թվականին...</p>
  </div>

  {/* Երկրորդ շարքը */}
  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739859337970--Logo_IMAGEMAN.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">ԻՄԵՅՋՄԵՆ Ինտերիեր-դիզայնի և...</p>
    <p className="text-sm">ԻՄԵՅՋՄԵՆ արվեստանոցը հիմնադրվել է <br /> 1999 թվականին...</p>
  </div>

  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739874444574--WhatsApp_Image_2025-02-18_at_14.15.03_101ceb94.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">ԴԱԱՊ Ճարտարապետական․․․</p>
    <p className="text-sm">ԴԱԱՊ ճարտարապետական արվեստանոցը <br /> նախկին «QC Architects»-ի համահիմնադիր...</p>
  </div>

  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740464484847--IMG_20250225_101526_731.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">ՆԵՐԳԱՂԹ ՃԱՐՏԱՐԱՊԵՏԱԿԱՆ</p>
    <p className="text-sm">Ներգաղթ ճարտարապետական <br /> արվեստանոցը հիմնադրվել է 2006թ․-ին...</p>
  </div>

  <div className="text-center">
    <img
      className="h-[180px] w-[250px] rounded-lg mx-auto"
      src="https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1741863888966--Logo_16x10.webp&w=1920&q=75"
      alt=""
    />
    <p className="font-semibold mt-2">ՋԻ-ԷՄ-ՋԻ Ինթիրիորս</p>
    <p className="text-sm">Ջի–Էմ–Ջի Ինթիրիորս ստուդիան <br /> հիմնադրվել է 2018 թվականին...</p>
  </div>
</div>
<div></div>
    </>
  );
}

export default Home;    