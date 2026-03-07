import React from "react";
import React, { useState } from "react";

function Footer(){
      const [checked, setChecked] = useState(false);
    return(
        <>
        <div className="bg-gray-900 h-[800px] w-[1520px]">
            <div className="з-4 border border-white h-[450px] w-[500px] rounded-lg">
                <p className="text-white font-bold text-2xl p-4">Հետադարձ կապ</p>
                <p className="text-white text-sm">Լրացրեք տվյալները և մենք կկապնվենք Ձեզ հետ հնարավորինս <br />
                 շուտ։</p>
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="text" placeholder="Անուն" />
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="text" placeholder="Էլ․հասցե" />
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="number" placeholder="+374" />
                 <input className="text-white w-[400px] h-[35px] rounded-lg" type="text" placeholder="Կազմակերպություն" />
                 <br />
                 <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"/>
      <span className="text-gray-700 select-none">
        Համաձայն եմ կայքի պայմաններին
      </span>
    </label>
            </div>
        </div>
        </>
    );
}
export default Footer;