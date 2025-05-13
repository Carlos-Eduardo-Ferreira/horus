"use client";

import { useGlobalHook } from "@/hooks/global.hook";
import { BiArrowFromLeft, BiArrowFromRight } from "react-icons/bi";
import { NotificationIcon } from "./NotificationIcon";
import { UserInfo } from "./UserInfo";

const Header = ({ className = "" }) => {
  const { toggleMenu, isMenuOpen } = useGlobalHook();

  return (
    <header className={`sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b border-gray-200 ${className}`}>
      <button onClick={toggleMenu} className="text-3xl cursor-pointer">
        {isMenuOpen ? (
          <BiArrowFromRight className="text-gray-500" />
        ) : (
          <BiArrowFromLeft className="text-gray-500" />
        )}
      </button>
      <div className="flex items-center max-md:gap-4 md:gap-1">
        <NotificationIcon />
        <UserInfo />
      </div>
    </header>
  );
};

export { Header };