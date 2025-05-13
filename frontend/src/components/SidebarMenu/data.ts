import { MdDashboard, MdSettings } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdOptions } from "react-icons/io";
import { IconType } from "react-icons";

export type IMenuSideBarProps = {
  id: number;
  title: string;
  path?: string;
  icon?: IconType;
  subMenu?: boolean;
  subMenuItems?: IMenuSideBarProps[];
};

const menuSideBarItem: IMenuSideBarProps[] = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: MdDashboard,
  },
  {
    id: 2,
    title: "Relatórios",
    path: "#",
    icon: IoDocumentTextOutline,
    subMenu: true,
    subMenuItems: [
      { id: 1, title: "Relatórios 1", path: "#" },
      { id: 2, title: "Relatórios 2", path: "#" },
      { id: 3, title: "Relatórios 3", path: "#" },
      { id: 4, title: "Relatórios 4", path: "#" },
    ],
  },
  {
    id: 3,
    title: "Configurações",
    path: "#",
    icon: MdSettings,
    subMenu: true,
    subMenuItems: [
      { id: 1, title: "Configurações 1", path: "#" },
      { id: 2, title: "Configurações 2", path: "#" },
      { id: 3, title: "Configurações 3", path: "#" },
      { id: 4, title: "Configurações 4", path: "#" },
    ],
  },
  {
    id: 4,
    title: "Preferências",
    path: "#",
    icon: IoMdOptions,
  },
];

export { menuSideBarItem };