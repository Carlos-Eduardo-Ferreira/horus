"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { footerItemsData, linksData } from "./data";
import { IoExpandOutline, IoContractOutline } from "react-icons/io5";

const Footer = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className={`bg-gray-100 border-t border-gray-200 ${className}`}>
      <div className="w-full mx-auto flex flex-col gap-4 px-4 sm:px-8 pt-3">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
          {/* Mobile: Apenas copyright e botão de expansão */}
          <div className="flex w-full justify-between items-center lg:hidden">
            <button
              onClick={toggle}
              className="text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
            >
              {isOpen ? <IoContractOutline size={20} /> : <IoExpandOutline size={20} />}
            </button>
            <span className="text-gray-600 text-xs text-center">
              Todos os direitos reservados © Lorem Ipsum
            </span>
          </div>
          
          {/* Desktop: Layout completo */}
          <div className="hidden lg:flex flex-row items-center gap-8">
            <button
              onClick={toggle}
              className="text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
            >
              {isOpen ? <IoContractOutline size={20} /> : <IoExpandOutline size={20} />}
            </button>
            <div className="flex flex-row items-center gap-6">
              {linksData.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="text-gray-600 text-xs md:text-sm hover:text-primary transition-colors duration-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <span className="hidden lg:block text-gray-600 text-xs md:text-sm text-center">
            Todos os direitos reservados © Lorem Ipsum
          </span>
        </div>

        {isOpen && (
          <div
            ref={accordionRef}
            className="transition-all duration-300 ease-in-out pb-3"
          >
            {/* Versão mobile dos links quando expandido - 2 links por linha */}
            <div className="lg:hidden grid grid-cols-2 gap-4 mb-4">
              {linksData.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="text-gray-600 text-sm hover:text-primary transition-colors duration-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              <Image
                className="rounded-lg mb-4 lg:mb-0"
                src="/assets/logo-colored.png"
                alt="Logo"
                width={160}
                height={48}
              />
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full text-gray-600 text-xs md:text-sm">
                {footerItemsData.map((item) => (
                  <span key={item.id} className="font-medium">
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export { Footer };