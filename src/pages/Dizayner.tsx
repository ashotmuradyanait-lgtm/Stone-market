import React from "react";

// 1. Սահմանում ենք տիպը դիզայների օբյեկտի համար
interface DesignerInfo {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
}

const Dizayner: React.FC = () => {
  // 2. Տվյալների զանգվածը (Array), որը թույլ է տալիս խուսափել կոդի կրկնությունից
  const designers: DesignerInfo[] = [
    {
      id: 1,
      name: "Unique Design",
      description: "Ճարտարապետական ​​3D մոդելների մշակում ըստ ձեր գծագրերի և էսքիզների...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740466806085--Messenger_creation_4D4BF230-75CC-4580-A6C6-5B77D4AED49E.webp&w=1920&q=75"
    },
    {
      id: 2,
      name: "ARCHITECTUM LLC",
      description: "1. Էսքիզային նախագծերի մշակում, ցուցադրական նյութերի պատրաստում...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739358817839--WhatsApp_Image_2025-02-12_at_15.01.36_b320a8a6.webp&w=1920&q=75"
    },
    {
      id: 3,
      name: "LUMINAR studio",
      description: "Նախագծման ընթացքում մեր փորձառու մասնագետները կիրառում են միմիայն...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739528262438--WhatsApp_Image_2025-02-14_at_13.51.57_73d0dfcd.webp&w=1920&q=75"
    },
    {
      id: 4,
      name: "SILAS DESIGN AND CONSTRUCTION",
      description: "SILAS DESIGN AND CONSTRUCTION հիմնադրվել է 2010 թվականին...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743664023548--photo_2025-04-03_11-05-29.webp&w=1920&q=75"
    },
    {
      id: 5,
      name: "ԻՄԵՅՋՄԵՆ Ինտերիեր-դիզայնի և...",
      description: "ԻՄԵՅՋՄԵՆ արվեստանոցը հիմնադրվել է 1999 թվականին...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739859337970--Logo_IMAGEMAN.webp&w=1920&q=75"
    },
    {
      id: 6,
      name: "ԴԱԱՊ Ճարտարապետական․․․",
      description: "ԴԱԱՊ ճարտարապետական արվեստանոցը նախկին «QC Architects»-ի համահիմնադիր...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739874444574--WhatsApp_Image_2025-02-18_at_14.15.03_101ceb94.webp&w=1920&q=75"
    },
    {
      id: 7,
      name: "ՆԵՐԳԱՂԹ ՃԱՐՏԱՐԱՊԵՏԱԿԱՆ",
      description: "Ներգաղթ ճարտարապետական արվեստանոցը հիմնադրվել է 2006թ․-ին...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740464484847--IMG_20250225_101526_731.webp&w=1920&q=75"
    },
    {
      id: 8,
      name: "ՋԻ-ԷՄ-ՋԻ Ինթիրիորս",
      description: "Ջի–Էմ–Ջի Ինթիրիորս ստուդիան հիմնադրվել է 2018 թվականին...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1741863888966--Logo_16x10.webp&w=1920&q=75"
    },
    {
      id: 9,
      name: "«Archimikanika» արվեստանոց",
      description: "«Archimikanika» արվեստանոցը հիմնադրվել է 2013թ.-ին ճարտարապետ․․․",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743496374536--photo_2025-04-01_12-07-17_(3).webp&w=1920&q=75"
    },
    {
      id: 10,
      name: "EIMI DESIGN CONSTRUCTION",
      description: "Նախգծում ենք տարբեր տեսակի տարածքներ՝...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743515286102--530DE1F7-D095-4A8B-BBC0-64BA3DFA4C6F%5B1%5D.webp&w=1920&q=75"
    },
    {
      id: 11,
      name: "UPROject",
      description: "Ճարտարապետություն, ինտերիերի դիզայն, գրաֆիկ դիզայն...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1745225933703--WhatsApp_Image_2025-04-21_at_12.34.35_3c21b472.webp&w=1920&q=75"
    },
    {
      id: 12,
      name: "Ակկուռատ Գրուպ ՍՊԸ",
      description: "«Ակկուռատ Գրուպ» ընկերությունը հիմնադրվել է 2002թ.-ին...",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1745317648399--WhatsApp_Image_2025-02-24_at_14.49.41_c7e30489.webp&w=1920&q=75"
    },
    {
      id: 13,
      name: "Ատրիում ճարտարապետական․․․",
      description: "Ատրիում ճարտարապետական արվեստանոցը հիմնադրվել է 2006 թ․-ին․․․",
      imgUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1745933324974--WhatsApp_Image_2025-04-29_at_15.34.50_8c599435.webp&w=1920&q=75"
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-8">
        <h1 className="text-center text-3xl font-bold text-gray-800">Դիզայներներ</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6 max-w-7xl mx-auto">
        {designers.map((designer) => (
          <div 
            key={designer.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col items-center text-center"
          >
            <div className="h-[180px] w-full flex items-center justify-center mb-4">
              <img
                className="max-h-full max-w-full rounded-lg object-contain"
                src={designer.imgUrl}
                alt={designer.name}
              />
            </div>
            <h2 className="font-bold text-lg text-gray-900 mb-2">{designer.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {designer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dizayner;