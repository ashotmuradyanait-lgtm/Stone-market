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
    </>
  );
}

export default Home;    