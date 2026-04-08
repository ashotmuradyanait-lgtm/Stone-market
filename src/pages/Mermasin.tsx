import React from "react";

// 1. Սահմանում ենք նախագծի տվյալների տիպը
interface Project {
  id: number;
  title: string;
  description: string;
  imgUrl: string;
}

const Mermasin: React.FC = () => {
  // 2. Նախագծերի տվյալները
  const projects: Project[] = [
    {
      id: 1,
      title: "Սթոուն Գրուպ",
      description: "«Սթոուն Գրուպ»-ը տրավերտինի հանքարդյունահանմամբ զբաղվող առաջատար ընկերություն է։ Ամսական 1200 խորանարդ մետրից ավել հանույթ ունենալով՝ ապահովում է բարձրորակ տրավերտինի կայուն մատակարարում։",
      imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject1.jpeg&w=1920&q=75",
    },
    {
      id: 2,
      title: "Սարարտ Սթոուն",
      description: "Հայաստանի սիմվոլներից մեկը՝ սև տուֆը, կարևոր տեղ ունի մեր գործունեության մեջ։ «Սարարտ Սթոուն»-ը մասնագիտացած է սև տուֆի արդյունաբերության մեջ և ապահովում է որակի և հուսալիության բարձր մակարդակ։",
      imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject2.webp&w=1920&q=75",
    },
    {
      id: 3,
      title: "Սթոուն հոլդինգ",
      description: "«Սթոուն Հոլդինգ» ընկերությունը մասնագիտացած է երեսպատման սալիկների, ճարտարապետական բարդ դետալների արտադրության և վերամշակման մեջ։",
      imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject3.jpeg&w=1920&q=75",
    },
    {
      id: 4,
      title: "Հայկական քարի փառատոն",
      description: "Հայկական քարի փառատոնն ամենամյա միջոցառում է, որն անցկացվում է 2021-ից։ Այն ներկայացնում է հայկական բնական քարերի առանձնահատկությունները և միավորում ոլորտի առաջատար ընկերություններին։",
      imgUrl: "https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject4.JPG&w=1920&q=75",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      <div className="bg-gray-900 w-full text-center p-8 md:p-16">
        <div className="flex justify-center mb-6">
          <img
            className="h-20 w-20 md:h-24 md:w-24 object-contain"
            src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fpetro-stone-logo.png&w=1920&q=75"
            alt="Petro Stone Logo"
          />
        </div>
        <h2 className="text-white font-bold text-3xl md:text-4xl mb-6">Պետրո Սթոուն</h2>
        <p className="text-gray-300 max-w-4xl mx-auto leading-relaxed text-sm md:text-lg">
          «Պետրո Սթոուն» ընկերությունների խումբը զբաղվում է բնական քարերի արդյունահանմամբ,
          մշակմամբ և վաճառքով՝ ապահովելով ծառայությունների ամբողջական ցիկլ։
        </p>
      </div>

      {/* Intro Section */}
      <div className="px-6 md:px-10 py-16 text-center max-w-6xl mx-auto">
        <p className="font-bold text-3xl text-gray-800 mb-4">STONE MARKET</p>
        <h1 className="font-semibold text-xl md:text-2xl text-gray-700 mb-6">
          Բնական քարի համաշխարհային շուկայի հայկական հարթակը
        </h1>
        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
          Stonemarket-ն առաջին հայկական օնլայն հարթակն է, որը միավորում է բնական քարի
          արդյունահանմամբ, մշակմամբ և վաճառքով զբաղվող ընկերություններին մեկ տեղում։
        </p>
      </div>

      {/* Mission Section */}
      <div className="px-6 md:px-10 pb-16 text-center bg-gray-50 py-12">
        <h3 className="font-bold text-2xl text-gray-800 mb-6 uppercase tracking-wider">
          Մեր առաքելությունը
        </h3>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto italic">
          «Արտադրողներին և դիզայներներին տալ իրական հարթակ՝ որտեղ քարը դառնում է բրենդ,
          իսկ արտադրանքը՝ պատմություն։»
        </p>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto py-12">
        <h2 className="text-center font-bold text-3xl md:text-4xl mb-12 text-gray-900">
          Մեր Նախագծերը
        </h2>

        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`flex flex-col ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-10 px-6 md:px-10 py-12 border-b border-gray-100 last:border-0`}
          >
            <div className="lg:w-1/2 space-y-4">
              <h4 className="font-bold text-2xl text-gray-800">{project.title}</h4>
              <p className="text-gray-600 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
              <img
                className="w-full h-[300px] md:h-[450px] object-cover rounded-3xl shadow-lg transition-transform hover:scale-[1.02] duration-300"
                src={project.imgUrl}
                alt={project.title}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Quote */}
      <div className="py-16 px-6 bg-gray-900 text-white text-center">
        <p className="text-xl md:text-2xl font-medium max-w-4xl mx-auto italic opacity-90">
          «Հայկական բնական քարը պետք է խոսի ինքն իր անունից՝ որակով, դիզայնով և վստահությամբ»։
        </p>
      </div>
    </div>
  );
};

export default Mermasin;