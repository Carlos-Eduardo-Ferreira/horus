"use client";

import { useGlobalHook } from "@/hooks/global.hook";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { SubMenu } from "../Submenu";
import { IMenuSideBarProps, menuSideBarItem } from "./data";
import Image from "next/image";

const iconSize = 20;

const SidebarMenu = () => {
  const { isMenuOpen } = useGlobalHook();
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const router = useRouter();
  const { toggleMenu } = useGlobalHook();

  const toggleSubMenu = (index: number) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      setOpenSubMenu(null);
    }
  }, [isMenuOpen]);

  const sidebarVariants = {
    open: {
      width: "15rem",
      transition: { type: "tween", duration: 0.3 },
    },
    closed: {
      width: "88px",
      transition: { type: "tween", duration: 0.3 },
    },
  };

  const subMenuVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: { type: "tween", duration: 0.3 },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { type: "tween", duration: 0.3 },
    },
  };

  return (
    <motion.div
      className={`h-screen flex flex-col bg-gray-900 z-40
        ${!isMenuOpen && "hidden md:block"}
        ${
          isMenuOpen &&
          "w-20 md:w-98 max-md:w-full max-md:absolute max-md:h-screen"
        }
        `}
      variants={sidebarVariants}
      initial={isMenuOpen ? "open" : "closed"}
      animate={isMenuOpen ? "open" : "closed"}
    >
      <div
        className={
          "flex items-center justify-center max-md:justify-between"
        }
      >
        <Image
          src={isMenuOpen ? "/assets/logo-open.png" : "/assets/logo-closed.png"}
          alt="Logo"
          width={isMenuOpen ? 150 : 44}
          height={64}
          className="py-4 cursor-pointer"
          style={{ width: isMenuOpen ? "150px" : "44px", height: "64px" }}
          priority
        />
        <button className="md:hidden pb-9 text-white">
          <CgClose
            size={iconSize}
            className="bg-transparent"
            onClick={toggleMenu}
          />
        </button>
      </div>
      <hr className="w-[85%] mx-auto border-gray-700" />
      <div className="flex flex-col h-full gap-4 items-center relative justify-start px-4 mt-5">
        {menuSideBarItem.map((item: IMenuSideBarProps, index: number) => (
          <div
            key={index}
            className={`relative group w-full last:mb-5
            ${isMenuOpen ? "last:mt-auto" : "last:mt-auto"}`}
          >
            <button
              className={`flex items-center p-1.5 w-full text-gray-100 color-hover-primary rounded-sm cursor-pointer ${
                isMenuOpen ? "gap-4 justify-start" : "justify-center"
              }`}
              onClick={() => 
                item.subMenu 
                  ? toggleSubMenu(index)
                  : router.push(item.path ?? "")
              }
            >
              <div
                data-tooltip-id={item.title}
                className="flex items-center justify-center color-side-bar-item"
              >
                {item.icon && <item.icon size={iconSize} />}
              </div>
              {!isMenuOpen && item.subMenuItems && (
                <div className="hidden top-0 left-[-2rem] right-0 group-hover:block group-hover:absolute">
                  <SubMenu menuSideBarItem={item} isMenuOpened={isMenuOpen} />
                </div>
              )}
              {isMenuOpen && (
                <>
                  <span className="text-base font-semibold">{item.title}</span>
                  {item.subMenu && (
                    <MdOutlineKeyboardArrowDown
                      size={iconSize}
                      className={`color-side-bar-item ml-auto transition-transform duration-300 ${
                        openSubMenu === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </>
              )}
              {!isMenuOpen && (
                <div className="bg-gray-900 color-side-bar-item font-semibold">
                  <ReactTooltip
                    id={item.title}
                    place="right"
                    content={item.title}
                    variant="dark"
                    opacity={1}
                    style={{
                      background: "inherit",
                      color: "inherit",
                      fontWeight: "inherit",
                      marginLeft: "1rem",
                    }}
                  />
                </div>
              )}
            </button>
            {item.subMenu && isMenuOpen && (
              <AnimatePresence>
                {openSubMenu === index && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={subMenuVariants}
                    className="z-20 overflow-hidden"
                  >
                    <SubMenu menuSideBarItem={item} isMenuOpened={isMenuOpen} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export { SidebarMenu };