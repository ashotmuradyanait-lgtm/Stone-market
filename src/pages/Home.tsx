import React from "react";
import { Link } from "react-router-dom";

// Տիպեր սահմանենք տվյալների համար
interface Partner {
  name: string;
  imgUrl: string;
  link: string;
}

interface Designer {
  name: string;
  imgUrl: string;
  description: string;
}

const Home: React.FC = () => {
  // 1. Գործընկերների տվյալները
  const partners: Partner[] = [
    { name: "Petro Stone Armenia", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fpetro-stone.png&w=1920&q=75", link: "https://petro-stone.am/" },
    { name: "AG Impex", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fag-impex.png&w=1920&q=75", link: "https://www.agimpex.am/hy" },
    { name: "Stone World Armenia", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fstone-world.png&w=1920&q=75", link: "https://stoneworld.am/pages/good-list.php?lang=en" },
    { name: "Qaramshak", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fqaramshak.png&w=1920&q=75", link: "https://www.instagram.com/qaramshaak/" },
    { name: "Stone Park", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fstone-park.png&w=1920&q=75", link: "https://www.armstone.am/" },
    { name: "Mane Tiles", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fmane-tiles.png&w=1920&q=75", link: "https://manetiles.com/" },
    { name: "Armenian Stone Studio", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Farmenian-stone-studio.png&w=1920&q=75", link: "https://www.facebook.com/MFScompany/" },
    { name: "Dadoyan Wood", imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fdadoyan-wood.png&w=1920&q=75", link: "https://www.instagram.com/dadoyan_wood/" },
  ];

  // 2. Դիզայներների տվյալները (ցուցադրվում է միայն մի մասը Home-ում)
  const designers: Designer[] = [
    { name: "Unique Design", description: "Ճարտարապետական ​​3D մոդելների մշակում...", imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740466806085--Messenger_creation_4D4BF230-75CC-4580-A6C6-5B77D4AED49E.webp&w=1920&q=75" },
    { name: "ARCHITECTUM LLC", description: "1. Էսքիզային նախագծերի մշակում...", imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739358817839--WhatsApp_Image_2025-02-12_at_15.01.36_b320a8a6.webp&w=1920&q=75" },
    { name: "LUMINAR studio", description: "Նախագծման ընթացքում մեր փորձառու...", imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739528262438--WhatsApp_Image_2025-02-14_at_13.51.57_73d0dfcd.webp&w=1920&q=75" },
    { name: "SILAS DESIGN AND CONSTRUCTION", description: "SILAS DESIGN AND CONSTRUCTION հիմնադրվել է 2010...", imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743664023548--photo_2025-04-03_11-05-29.webp&w=1920&q=75" },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 p-4">
        {/* Sidebar Categories */}
        <div className="bg-yellow-50 w-full lg:w-[350px] rounded-lg p-4 flex flex-col gap-4">
          {[
            { title: "Բնական քար", img: "natural-stones.png" },
            { title: "Արհեստական քար", img: "tiles-and-slabs.png" },
            { title: "Հաստոցներ", img: "indoor-products.png" },
            { title: "Քարամշակման գործիքներ", img: "sinks-washbasins.png" },
            { title: "Քիմիական նյութեր", img: "decorative-items.png" },
            { title: "Արտադրական ծառայություններ", img: "custom-products.png" },
            { title: "Mane Tiles", img: "mane-tiles-logo.png" },
          ].map((cat, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-yellow-100 rounded-md transition-colors cursor-pointer">
              <img className="h-12 w-12 object-contain" src={`https://www.stonemarket.am/_next/image?url=%2Fimages%2F${cat.img}&w=128&q=75`} alt={cat.title} />
              <p className="font-semibold text-sm">{cat.title}</p>
            </div>
          ))}
        </div>

        {/* Hero Video */}
        <div className="w-full">
          <video className="w-full lg:w-[900px] h-[300px] lg:h-[550px] rounded-lg shadow-lg object-cover" controls muted autoPlay loop>
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="p-6 lg:p-20">
        <img className="w-full rounded-xl shadow-sm" src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Frocket-line.jpg&w=1920&q=75" alt="Banner" />
      </div>

      {/* Partners Section */}
      <section className="py-10">
        <h1 className="text-center font-bold font-serif text-2xl lg:text-3xl mb-6">Մեր Գործընկերները</h1>
        <p className="text-center max-w-3xl mx-auto px-6 text-gray-600 mb-10">
          Մեր գործընկերները ներկայացնում են բարձրորակ քարեր և կոպեր, որոնք առաջարկում են նորարարական լուծումներ:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center p-6 max-w-7xl mx-auto">
          {partners.map((partner, idx) => (
            <div key={idx} className="text-center group">
              <div className="h-24 flex items-center justify-center">
                <img className="w-32 lg:w-40 grayscale group-hover:grayscale-0 transition-all" src={partner.imgUrl} alt={partner.name} />
              </div>
              <a href={partner.link} target="_blank" rel="noreferrer" className="block mt-2 text-blue-600 hover:underline text-sm font-medium">
                {partner.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Designers Section */}
      <section className="bg-gray-50 py-10">
        <h1 className="text-center p-4 text-3xl font-semibold mb-8">Դիզայներներ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
          {designers.map((designer, idx) => (
            <div key={idx} className="text-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <img className="h-44 w-full object-cover rounded-lg mb-4" src={designer.imgUrl} alt={designer.name} />
              <p className="font-bold text-gray-800">{designer.name}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{designer.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/dizayner" className="px-10 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg">
            Ավելին
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;