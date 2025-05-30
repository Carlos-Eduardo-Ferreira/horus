import { MdDashboard, MdSecurity } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import { IconType } from "react-icons";

export type IMenuSideBarProps = {
  title: string;
  path?: string;
  icon?: IconType;
  subMenu?: boolean;
  subMenuItems?: IMenuSideBarProps[];
};

const menuSideBarItem: IMenuSideBarProps[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Cadastros ACL",
    icon: MdSecurity,
    subMenu: true,
    subMenuItems: [
      {
        title: "Ações de Usuário",
        path: "/actions",
      },
      {
        title: "Módulos",
        path: "/modules",
      },
    ],
  },
  {
    title: "Preferências",
    icon: IoMdOptions,
  },
];

export { menuSideBarItem };