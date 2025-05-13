"use client";

import { useGlobalHook } from "@/hooks/global.hook";
import { BiArrowFromLeft, BiArrowFromRight } from "react-icons/bi";
import { NotificationIcon } from "./NotificationIcon";
import { UserInfo } from "./UserInfo";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ className = "" }) => {
  const { toggleMenu, isMenuOpen } = useGlobalHook();

  return (
    <header className={`sticky top-0 z-10 flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 ${className}`}>
      <button onClick={toggleMenu} className="text-3xl cursor-pointer">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isMenuOpen ? "right" : "left"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isMenuOpen ? (
            <BiArrowFromRight className="text-gray-500" />
          ) : (
            <BiArrowFromLeft className="text-gray-500" />
          )}
        </motion.div>
      </AnimatePresence>
      </button>
      <div className="flex items-center">
        <NotificationIcon />
        <UserInfo />
      </div>
    </header>
  );
};

export { Header };