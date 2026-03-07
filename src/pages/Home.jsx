import React from "react";


function Home() {
  return (
    <>
    <div className="p-20">
        <img src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Frocket-line.jpg&w=1920&q=75" alt="" />
    </div>
    <div>
        <h1 className="text-center font-bold font-serif text-3xl">Մեր Գործընկերները</h1>
        <p className="text-center p-6">Մեր գործընկերները ներկայացնում են բարձրորակ քարեր և կոպեր, որոնք առաջարկում են նորարարական լուծումներ: <br /> 
        Յուրաքանչյուր գործընկեր կարևոր է մեր առաքելության համար՝ ստեղծել գեղեցիկ միջավայրեր, որտեղ քարերը պատմում են <br />
         իրենց պատմությունները:</p>
    </div>
    <div className="flex gap-50">
        <div>
        <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fpetro-stone.png&w=1920&q=75" alt="" />
        <a href="https://petro-stone.am/">Petro Stone Armenia</a>
        </div>
        <div>
         <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fag-impex.png&w=1920&q=75" alt="" />
        <a href="https://www.agimpex.am/hy">AG Impex</a>
        </div>
        <div>
        <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fstone-world.png&w=1920&q=75" alt="" />
        <a href="https://stoneworld.am/pages/good-list.php?lang=en">Stone World Armenia</a>
        </div>
        <div>
        <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fqaramshak.png&w=1920&q=75" alt="" />
        <a href="https://www.instagram.com/qaramshaak/">Qaramshak</a>
        </div>
    </div>
    <div className="flex gap-50 p-10">
        <div>
        <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fstone-park.png&w=1920&q=75" alt="" />
        <a href="https://www.armstone.am/">Stone Park</a>
        </div>
        <div>
         <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fmane-tiles.png&w=1920&q=75" alt="" />
        <a href="https://manetiles.com/">Mane Tiles</a>
        </div>
        <div>
        <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Farmenian-stone-studio.png&w=1920&q=75" alt="" />
        <a href="https://www.facebook.com/MFScompany/">Armenian Stone Studio</a>
        </div>
        <div>
        <img className="w-[150px] h-[50px]" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fdadoyan-wood.png&w=1920&q=75" alt="" />
        <a href="https://www.instagram.com/dadoyan_wood/">Dadoyan Wood.</a>
        </div>
    </div>
    </>
  );
}

export default Home;