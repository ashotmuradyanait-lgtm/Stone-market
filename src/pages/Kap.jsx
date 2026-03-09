import React from "react";

function Kap(){
    return(
        <>
       <p className="font-semibold text-center text-3xl mb-6">Կոնտակտներ</p>

<div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 bg-gray-100 w-full p-6">

  <div className="flex flex-col items-center gap-2">
    <img src="https://www.stonemarket.am/icons/contacts-phone.svg" alt="phone" />
    <a href="tel:+37433767377">
      +374 (33) 76 - 73 - 77
    </a>
  </div>

  <div className="flex flex-col items-center gap-2">
    <img src="https://www.stonemarket.am/icons/contacts-mail.svg" alt="mail" />
    <a href="mailto:sstonemarket@yandex.ru">
      sstonemarket@yandex.ru
    </a>
  </div>

  <div className="flex flex-col items-center gap-2">
    <img src="https://www.stonemarket.am/icons/contacts-instagram.svg" alt="instagram"/>
    <a href="https://www.instagram.com/stonemarket.am">
      stonemarket.am
    </a>
  </div>

  <div className="flex flex-col items-center gap-2">
    <img src="https://www.stonemarket.am/icons/contacts-facebook.svg" alt="facebook"/>
    <a href="https://www.facebook.com/stonemarket.armenia">
      Stone Market
    </a>
  </div>

  <div className="flex flex-col items-center gap-2">
    <img src="https://www.stonemarket.am/icons/contacts-whatsapp.svg" alt="whatsapp" />
    <a href="https://wa.me/37433767377">
      WhatsApp
    </a>
  </div>

</div>
        </>
    );
}
export default Kap;

