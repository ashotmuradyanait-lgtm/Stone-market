import React from "react";

function Kap(){
    return(
        <>
        <p className="font-semibold  text-center text-3xl">Կոնտակտներ</p>
        <div className="flex gap-30 bg-gray-100 h-[150px] w-full p-6">
        <div>
            <img src="https://www.stonemarket.am/icons/contacts-phone.svg" alt="" />
            <a href="tel:+37433767377">+374 (33) 76 - 73 - 77</a>
        </div>
        <div>
            <img src="https://www.stonemarket.am/icons/contacts-mail.svg" alt="" />
            <a href="mailto:sstonemarket@yandex.ru">sstonemarket@yandex.ru</a>
        </div>
        <div>
            <img src="https://www.stonemarket.am/icons/contacts-instagram.svg" alt="" />
            <a href="https://www.instagram.com/stonemarket.am/?igsh=MTBsemIxZG94Nmwzaw%3D%3D#">stonemarket.am</a>
        </div>
        <div>
            <img src="https://www.stonemarket.am/icons/contacts-facebook.svg" alt="" />
            <a href="https://www.facebook.com/stonemarket.armenia?mibextid=LQQJ4d">Stone Market</a>
        </div>
        <div>
            <img src="https://www.stonemarket.am/icons/contacts-whatsapp.svg" alt="" />
            <a href="https://wa.me/37433767377">WhatsApp</a>
        </div>
        </div>
        </>
    );
}
export default Kap;

