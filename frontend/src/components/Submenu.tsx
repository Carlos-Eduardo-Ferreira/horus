import { useGlobalHook } from "@/hooks/global.hook";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IMenuSideBarProps } from "./SidebarMenu/types";

interface ISubMenuProps {
  isMenuOpened: boolean;
  menuSideBarItem: IMenuSideBarProps;
}

const SubMenu = ({
  isMenuOpened,
  menuSideBarItem: _menuSideBarItem,
}: ISubMenuProps) => {
  const { isMenuOpen } = useGlobalHook();
  const pathname = usePathname();

  const isSubItemActive = (subItem: IMenuSideBarProps): boolean => {
    return !!(subItem.path && pathname && pathname.startsWith(subItem.path));
  };

  return (
    <div
      className={` flex flex-col relative bg-gray-900 w-screen max-w-[18rem] box-border 
      ${!isMenuOpen ? "rounded-tr-lg rounded-br-lg z-10" : ""}
      ${isMenuOpened ? "mx-auto my-auto left-0" : "left-0"} `}
    >
      <div
        className={`flex color-hover-primary border-none ${
          !isMenuOpen ? "rounded-tr-lg" : ""
        } `}
      >
        {!isMenuOpen && (
          <div className="flex w-full items-center gap-3 pl-8 h-14 justify-between">
            {_menuSideBarItem.icon && (
              <div className="flex items-center justify-center">
                <_menuSideBarItem.icon size={24} className="color-side-bar-item" />
              </div>
            )}
            <span className="color-side-bar-item text-lg font-semibold">
              {_menuSideBarItem.title}
            </span>
            <div className="ml-auto">
              <MdOutlineKeyboardArrowDown
                size={24}
                className={`color-side-bar-item mr-6`}
              />
            </div>
          </div>
        )}
      </div>
      {_menuSideBarItem.subMenuItems!.map((Subitem, Subindex) => (
        <div key={Subindex}>
          <Link
            className={`text-sm p-1 bg-gray-900/100 color-hover-primary flex items-center min-h-[2.75rem] transition-colors duration-200 ${
              !isMenuOpen ? "last:rounded-br-lg pl-18" : "pl-12"
            } ${
              isSubItemActive(Subitem)
                ? "color-active"
                : "text-white hover:text-blue-300"
            }`}
            href={Subitem.path!}
          >
            {Subitem.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export { SubMenu };