import React from "react";

// 1. Սահմանում ենք դիզայների տվյալների կառուցվածքը
interface Designer {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const Design: React.FC = () => {
  // 2. Տվյալների զանգվածը (ավելի հեշտ է ավելացնել կամ փոխել)
  const designers: Designer[] = [
    {
      id: 1,
      name: "Unique Design",
      description: "Ճարտարապետական ​​3D մոդելների մշակում ըստ ձեր գծագրերի և էսքիզների...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740466806085--Messenger_creation_4D4BF230-75CC-4580-A6C6-5B77D4AED49E.webp&w=1920&q=75"
    },
    {
      id: 2,
      name: "ARCHITECTUM LLC",
      description: "1. Էսքիզային նախագծերի մշակում, ցուցադրական նյութերի պատրաստում...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739358817839--WhatsApp_Image_2025-02-12_at_15.01.36_b320a8a6.webp&w=1920&q=75"
    },
    {
      id: 3,
      name: "LUMINAR studio",
      description: "Նախագծման ընթացքում մեր փորձառու մասնագետները կիրառում են միմիայն...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739528262438--WhatsApp_Image_2025-02-14_at_13.51.57_73d0dfcd.webp&w=1920&q=75"
    },
    {
      id: 4,
      name: "SILAS DESIGN AND CONSTRUCTION",
      description: "SILAS DESIGN AND CONSTRUCTION հիմնադրվել է 2010 թվականին...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743664023548--photo_2025-04-03_11-05-29.webp&w=1920&q=75"
    },
    {
      id: 5,
      name: "ԻՄԵՅՋՄԵՆ Ինտերիեր-դիզայնի և...",
      description: "ԻՄԵՅՋՄԵՆ արվեստանոցը հիմնադրվել է 1999 թվականին...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739859337970--Logo_IMAGEMAN.webp&w=1920&q=75"
    },
    {
      id: 6,
      name: "ԴԱԱՊ Ճարտարապետական․․․",
      description: "ԴԱԱՊ ճարտարապետական արվեստանոցը նախկին «QC Architects»-ի համահիմնադիր...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1739874444574--WhatsApp_Image_2025-02-18_at_14.15.03_101ceb94.webp&w=1920&q=75"
    },
    {
      id: 7,
      name: "ՆԵՐԳԱՂԹ ՃԱՐՏԱՐԱՊԵՏԱԿԱՆ",
      description: "Ներգաղթ ճարտարապետական արվեստանոցը հիմնադրվել է 2006թ․-ին...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1740464484847--IMG_20250225_101526_731.webp&w=1920&q=75"
    },
    {
      id: 8,
      name: "ՋԻ-ԷՄ-ՋԻ Ինթիրիորս",
      description: "Ջի–Էմ–Ջի Ինթիրիորս ստուդիան հիմնադրվել է 2018 թվականին...",
      imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1741863888966--Logo_16x10.webp&w=1920&q=75"
    },
    {
        id: 9,
        name: "«Archimikanika» արվեստանոց",
        description: "«Archimikanika» արվեստանոցը հիմնադրվել է 2013թ.-ին ճարտարապետ․․․",
        imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743496374536--photo_2025-04-01_12-07-17_(3).webp&w=1920&q=75"
    },
    {
        id: 10,
        name: "EIMI DESIGN CONSTRUCTION",
        description: "Նախգծում ենք տարբեր տեսակի տարածքներ՝...",
        imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1743515286102--530DE1F7-D095-4A8B-BBC0-64BA3DFA4C6F%5B1%5D.webp&w=1920&q=75"
    },
    {
        id: 11,
        name: "UPROject",
        description: "Ճարտարապետություն, ինտերիերի դիզայն, գրաֆիկ դիզայն...",
        imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1745225933703--WhatsApp_Image_2025-04-21_at_12.34.35_3c21b472.webp&w=1920&q=75"
    },
    {
        id: 12,
        name: "Ակկուռատ Գրուպ ՍՊԸ",
        description: "«Ակկուռատ Գրուպ» ընկերությունը հիմնադրվել է 2002թ.-ին...",
        imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1745317648399--WhatsApp_Image_2025-02-24_at_14.49.41_c7e30489.webp&w=1920&q=75"
    },
    {
        id: 13,
        name: "Ատրիում ճարտարապետական․․․",
        description: "Ատրիում ճարտարապետական արվեստանոցը հիմնադրվել է 2006 թ․-ին․․․",
        imageUrl: "https://www.stonemarket.am/_next/image?url=https%3A%2F%2Fapi.stonemarket.am%2F1745933324974--WhatsApp_Image_2025-04-29_at_15.34.50_8c599435.webp&w=1920&q=75"
    }
  ];

  return (
    <div className="bg-gray-200 min-h-screen w-full">
      <div className="bg-gray-200 w-full">
        <h1 className="text-center p-6 text-3xl font-semibold text-gray-800">Դիզայներներ</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {designers.map((designer) => (
          <div 
            key={designer.id} 
            className="text-center bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              className="h-[180px] w-full max-w-[250px] object-cover rounded-lg mx-auto mb-4"
              src={designer.imageUrl}
              alt={designer.name}
            />
            <h3 className="font-bold text-lg text-gray-900 mb-2">{designer.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {designer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Design;