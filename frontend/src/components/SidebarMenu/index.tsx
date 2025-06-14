"use client";

import { useGlobalHook } from "@/hooks/global.hook";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthHook } from "@/hooks/auth.hook";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { CgClose } from "react-icons/cg";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { SubMenu } from "../Submenu";
import { IMenuSideBarProps } from "./types";
import { getMenuByRole } from "./menuFactory";
import { route } from "@/config/namedRoutes";
import Image from "next/image";

const iconSize = 20;

const SidebarMenu = () => {
  const { isMenuOpen, toggleMenu } = useGlobalHook();
  const { userRole, isLoading } = useUserRole();
  const { hasPermission } = useAuthHook();
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const [initialRender, setInitialRender] = useState(true);
  const [menuItems, setMenuItems] = useState<IMenuSideBarProps[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // Verifica se o usuário tem acesso baseado nas permissões
  const checkAccess = useCallback((item: IMenuSideBarProps): boolean => {
    // Sem permissão requerida = acesso liberado
    if (!item.permission && !item.permissions) return true;
    
    // Master sempre tem acesso total
    if (String(userRole) === 'master') return true;
    
    // Consumer/company não usam sistema de permissões
    if (!['admin', 'user'].includes(String(userRole))) return false;
    
    // Verifica array de permissões (qualquer uma garante acesso)
    if (item.permissions?.length) {
      return item.permissions.some(permission => hasPermission(permission));
    }
    
    // Verifica permissão única
    return item.permission ? hasPermission(item.permission) : false;
  }, [userRole, hasPermission]);

  // Filtra subitens de menu baseado nas permissões
  const filterSubItems = useCallback((subItems: IMenuSideBarProps[]): IMenuSideBarProps[] => {
    return subItems.filter(subItem => {
      if (!subItem.permission) return true;
      if (String(userRole) === 'master') return true;
      return hasPermission(subItem.permission);
    });
  }, [userRole, hasPermission]);

  // Filtro principal dos itens de menu
  const filterMenuItems = useCallback((items: IMenuSideBarProps[]): IMenuSideBarProps[] => {
    if (!userRole) return [];

    return items.filter(item => {
      const hasAccess = checkAccess(item);
      
      // Se tem acesso e é submenu, filtra os subitens
      if (hasAccess && item.subMenu && item.subMenuItems) {
        const filteredSubItems = filterSubItems(item.subMenuItems);
        item.subMenuItems = filteredSubItems;
        
        // Mostra submenu apenas se houver itens visíveis
        return filteredSubItems.length > 0;
      }
      
      return hasAccess;
    });
  }, [userRole, checkAccess, filterSubItems]);

  useEffect(() => {
    if (!isLoading && userRole) {
      const allMenuItems = getMenuByRole(userRole);
      const filteredItems = filterMenuItems(allMenuItems);
      setMenuItems(filteredItems);
    }
  }, [userRole, isLoading, filterMenuItems]);

  const isItemActive = (item: IMenuSideBarProps): boolean => {
    if (!item.subMenu && item.path && pathname === item.path) {
      return true;
    }
    
    if (item.subMenu && !isMenuOpen && item.subMenuItems) {
      return item.subMenuItems.some(subItem => 
        subItem.path && pathname && pathname.startsWith(subItem.path)
      );
    }
    
    return false;
  };

  useEffect(() => {
    setInitialRender(false);

    if (pathname && menuItems.length > 0) {
      const activeSubMenuIndex = menuItems.findIndex((item) =>
        item.subMenuItems?.some((subItem) => subItem.path && pathname.startsWith(subItem.path))
      );

      if (activeSubMenuIndex !== -1) {
        setOpenSubMenu(activeSubMenuIndex);
      }
    }
  }, [pathname, menuItems]);

  const toggleSubMenu = (index: number) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      setOpenSubMenu(null);
    }
  }, [isMenuOpen]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

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

  if (isLoading || !userRole) {
    return null;
  }

  return (
    <motion.div
      className={`min-h-screen flex flex-col bg-gray-900 z-40
        ${initialRender && !isMenuOpen ? "hidden md:block md:w-[88px]" : ""}
        ${initialRender && isMenuOpen ? "md:w-[15rem] max-md:w-full max-md:absolute max-md:h-screen" : ""}
        ${!initialRender && isMenuOpen ? "max-md:w-full max-md:absolute max-md:h-screen" : "hidden md:block"}
        ${!initialRender && isMenuOpen ? "md:w-98" : "md:w-20"}
      `}
      variants={sidebarVariants}
      initial={false}
      animate={isMenuOpen ? "open" : "closed"}
    >
      <div
        className={
          "flex items-center justify-center max-md:justify-between max-md:px-4"
        }
      >
        <Image
          src={isMenuOpen ? "/assets/logo-open.png" : "/assets/logo-closed.png"}
          alt="Logo"
          width={isMenuOpen ? 150 : 44}
          height={64}
          className="py-4 cursor-pointer"
          style={{ width: isMenuOpen ? "150px" : "44px", height: "auto" }}
          priority
          onClick={() => handleNavigation(route('dashboard'))}
        />
        <button className="md:hidden pb-4 color-side-bar-item">
          <CgClose
            size={iconSize}
            className="bg-transparent"
            onClick={toggleMenu}
          />
        </button>
      </div>
      <hr className="w-[85%] mx-auto border-gray-700" />
      <div className="flex flex-col h-full gap-4 items-center relative justify-start px-4 mt-5">
        {menuItems.map((item: IMenuSideBarProps, index: number) => {
          const isActive = isItemActive(item);

          return (
            <div
              key={`menu-item-${index}`}
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
                    : item.path
                    ? handleNavigation(item.path)
                    : undefined
                }
              >
                <div
                  data-tooltip-id={`tooltip-${index}`}
                  className={`flex items-center justify-center ${
                    isActive ? "color-active" : "color-side-bar-item"
                  }`}
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
                    <span
                      className={`text-base font-semibold ${
                        isActive ? "color-active" : "text-gray-100"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.subMenu && (
                      <MdOutlineKeyboardArrowDown
                        size={iconSize}
                        className={`ml-auto transition-transform duration-300 color-side-bar-item ${
                          openSubMenu === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>
                )}
                {!isMenuOpen && (
                  <div className="bg-gray-900 color-side-bar-item font-semibold">
                    <ReactTooltip
                      id={`tooltip-${index}`}
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
                      <SubMenu
                        menuSideBarItem={item}
                        isMenuOpened={isMenuOpen}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export { SidebarMenu };
