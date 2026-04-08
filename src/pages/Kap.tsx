import React from "react";

// 1. Սահմանում ենք կոնտակտի տիպը
interface ContactItem {
  id: number;
  label: string;
  value: string;
  href: string;
  icon: string;
}

const Kap: React.FC = () => {
  // 2. Կոնտակտների տվյալների զանգվածը
  const contacts: ContactItem[] = [
    {
      id: 1,
      label: "Phone",
      value: "+374 (33) 76 - 73 - 77",
      href: "tel:+37433767377",
      icon: "https://www.stonemarket.am/icons/contacts-phone.svg",
    },
    {
      id: 2,
      label: "Mail",
      value: "sstonemarket@yandex.ru",
      href: "mailto:sstonemarket@yandex.ru",
      icon: "https://www.stonemarket.am/icons/contacts-mail.svg",
    },
    {
      id: 3,
      label: "Instagram",
      value: "stonemarket.am",
      href: "https://www.instagram.com/stonemarket.am",
      icon: "https://www.stonemarket.am/icons/contacts-instagram.svg",
    },
    {
      id: 4,
      label: "Facebook",
      value: "Stone Market",
      href: "https://www.facebook.com/stonemarket.armenia",
      icon: "https://www.stonemarket.am/icons/contacts-facebook.svg",
    },
    {
      id: 5,
      label: "WhatsApp",
      value: "WhatsApp",
      href: "https://wa.me/37433767377",
      icon: "https://www.stonemarket.am/icons/contacts-whatsapp.svg",
    },
  ];

  return (
    <div className="py-10">
      <p className="font-semibold text-center text-3xl mb-10 text-gray-800">
        Կոնտակտներ
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-10 bg-gray-100 w-full p-8 rounded-xl shadow-inner">
        {contacts.map((contact) => (
          <div 
            key={contact.id} 
            className="flex flex-col items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="bg-white p-4 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
              <img 
                src={contact.icon} 
                alt={contact.label} 
                className="w-8 h-8"
              />
            </div>
            <a 
              href={contact.href} 
              target={contact.href.startsWith('http') ? "_blank" : "_self"}
              rel="noreferrer"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              {contact.value}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kap;