import { Link } from 'react-router-dom';
import React from 'react';

// 1. Սահմանում և export ենք անում Product տիպը, որպեսզի App.tsx-ն էլ տեսնի սա
export interface Product {
    name: string;
    price: string; // Եթե App.tsx-ում price-ը string | number է, դիր այդպես
    img: string;
    desc: string;
}

// 2. Սահմանում ենք Props-ների տիպերը
interface XanutProps {
    onLike: (product: Product) => void;
    wishlist: Product[];
}

const Xanut: React.FC<XanutProps> = ({ onLike, wishlist = [] }) => {
    // Ապրանքների ցուցակը
    const products: Product[] = [
        { name: "Բետոնե Սեղան N073", price: "600,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N073-1--1772700511503.webp", desc: "Սեղան բետոնից՝ յուրահատուկ և արտահայտիչ դիզայնով։" },
        { name: "Տրավերտինե հավաքածու N097", price: "2,500,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N097--1772606804540.webp", desc: "Սեղան և նստարաններ բնական տրավերտին քարից։" },
        { name: "Տրավերտինե հավաքածու N093", price: "350,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N093--1772606461964.webp", desc: "Արտահայտիչ կառուցվածքը համադրում է բնականը։" },
        { name: "Տրավերտինե դեկոր N082", price: "100,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N082--1772547557216.webp", desc: "Բնական տրավերտին քարից մոմակալ։" },
        { name: "Տրավերտինե դեկոր N076", price: "55,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N076--1772547139235.webp", desc: "Բնական տրավերտին քարից բաժակի տակդիրներ։" },
        { name: "Տրավերտինե սեղան N096", price: "700,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N096--1772527028615.webp", desc: "Սուրճի սեղան բնական տրավերտին քարից։" },
        { name: "Տրավերտինե Դեկոր N095", price: "150,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N095--1772526700987.webp", desc: "Բնական տրավերտին քարից Դեկոր։" },
        { name: "Տրավերտինե տումբա N094", price: "420,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N094--1772526193011.webp", desc: "Կոնսոլ բնական տրավերտին քարից։" },
        { name: "Տրավերտինե սեղան N092", price: "140,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N092--1772525821969.webp", desc: "Սեղան բնական տրավերտին քարից՝ կորաձև։" },
        { name: "Տրավերտինե սեղան N091", price: "60,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N091--1772525128594.webp", desc: "Սեղան բնական տրավերտին քարից՝ մինիմալիստական։" },
        { name: "Ճոպանի ռետինե անիվ N003", price: "15,000Դր.", img: "https://api.stonemarket.am/51--1772289339921.webp", desc: "Չափս - 320մմ" },
        { name: "Ճոպանի ռետինե անիվ N002", price: "7,000Դր.", img: "https://api.stonemarket.am/50--1772289267500.webp", desc: "Չափս - 200մմ" },
        { name: "Տրավերտինե սեղան N090", price: "300,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N090--1772183225619.webp", desc: "Սեղան բնական տրավերտին քարից։" },
        { name: "Ճոպանի ռետինե անիվ N001", price: "18,000Դր.", img: "https://api.stonemarket.am/49--1772182708560.webp", desc: "Չափս - 380մմ" },
        { name: "Տրավերտինե սեղան N087", price: "650,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N087--1771516046630.webp", desc: "Բնական քարե սեղան՝ քանդակային հիմքով։" },
        { name: "Տրավերտինե սեղան N083", price: "420,000Դր.", img: "https://api.stonemarket.am/%C3%94%C2%BF%C3%95%C2%88%C3%94%C2%B4_N083--1771513468233.webp", desc: "Մինիմալիստական քարե սեղան։" },
        { name: "Բուչարդա N007", price: "120,000Դր.", img: "https://api.stonemarket.am/45--1771352932080.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" },
        { name: "Բուչարդա N006", price: "68,000Դր.", img: "https://api.stonemarket.am/42--1771352825805.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" },
        { name: "Բուչարդա N005", price: "48,000Դր.", img: "https://api.stonemarket.am/39--1771352739919.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" },
        { name: "Բուչարդա N004", price: "11,000Դր.", img: "https://api.stonemarket.am/36--1771352625856.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" },
        { name: "Բուչարդա N003", price: "75,000Դր.", img: "https://api.stonemarket.am/35--1771352101825.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" },
        { name: "Բուչարդա N002", price: "46,000Դր.", img: "https://api.stonemarket.am/33--1771352042947.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" },
        { name: "Բուչարդա N001", price: "16,000Դր.", img: "https://api.stonemarket.am/32--1771351971555.webp", desc: "Բնական քարի մակերեսը կոպտացնելու համար։" }
    ];

    return (
        <div className="bg-gray-100 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="flex px-14 gap-2 pt-4 items-center">
                <Link to="/" className="text-gray-500 text-[14px] hover:text-green-600 transition-colors">Գլխավոր</Link>
                <img src="https://www.stonemarket.am/icons/arrow-right-black.svg" className="h-3" alt="arrow" />
                <p className="text-gray-700 text-[14px]">Խանութ</p>
            </div>

            {/* Categories */}
            <div className="px-14 p-8 flex gap-2 flex-wrap items-center">
                <p className="font-semibold text-gray-700 mr-2">Կատեգորիա:</p>
                {["Բնական քար", "Արհեստական քար", "Հաստոցներ", "Քարամշակման պարագաներ", "Քիմիական նյութեր", "Արտադրական ծառայություններ", "Mane Tiles"].map((cat) => (
                    <p key={cat} className="border border-gray-300 rounded-lg px-4 py-1 text-center hover:border-green-500 hover:text-green-600 cursor-pointer bg-white transition-all shadow-sm text-sm">
                        {cat}
                    </p>
                ))}
            </div>

            {/* Product Grid */}
            <div className="flex flex-wrap gap-6 px-14 justify-center max-w-[1400px] mx-auto">
                {products.map((item, index) => {
                    const isLiked = wishlist.some(fav => fav.name === item.name);

                    return (
                        <div key={index}
                             className="bg-white h-[380px] w-[280px] rounded-[20px] shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="relative h-[220px] p-2 overflow-hidden">
                                <Link to={`/project/${index}`}>
                                    <img 
                                        className="h-full w-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-110" 
                                        src={`https://www.stonemarket.am/_next/image?url=${encodeURIComponent(item.img)}&w=1920&q=75`} 
                                        alt={item.name} 
                                    />
                                </Link>
                                <img 
                                    className={`h-[38px] w-[38px] p-2 rounded-lg absolute bottom-2 right-4 cursor-pointer transition-all shadow-md z-10
                                        ${isLiked ? 'bg-red-500 scale-110' : 'bg-white/80 hover:bg-white'}`} 
                                    src={isLiked ? "https://www.stonemarket.am/icons/like-white.svg" : "https://www.stonemarket.am/icons/like-black.svg"} 
                                    alt="like"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onLike(item);
                                    }}
                                />
                            </div> 

                            <div className="p-4">
                                <p className="font-bold text-gray-800 text-sm truncate">{item.name}</p>
                                <p className="text-[11px] text-gray-500 h-[32px] overflow-hidden mt-1 leading-tight italic">
                                    {item.desc}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="font-black text-[16px] text-indigo-900">{item.price}</p>
                                    <div className="border border-green-500 h-[36px] w-[36px] p-2 rounded-lg cursor-pointer hover:bg-green-500 group/cart transition-colors">
                                        <img 
                                            className="w-full h-full transition-all group-hover/cart:brightness-0 group-hover/cart:invert" 
                                            src="https://www.stonemarket.am/icons/add-to-cart-black.svg" 
                                            alt="cart" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Xanut;