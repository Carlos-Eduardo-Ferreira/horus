import { MdDashboard, MdSecurity } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import { IMenuSideBarProps } from "./types";
import { route } from "@/config/namedRoutes";

export const adminMenu: IMenuSideBarProps[] = [
  {
    title: "Dashboard",
    path: route("dashboard"),
    icon: MdDashboard,
  },
  {
    title: "Cadastros ACL",
    icon: MdSecurity,
    subMenu: true,
    permissions: [
      "users.access",
      "local_units.access",
      "actions.access",
      "modules.access",
    ],
    subMenuItems: [
      { title: "Usuários", path: route("users"), permission: "users.access" },
      { title: "Unidades Locais", path: route("localUnits"), permission: "local_units.access" },
      { title: "Ações de Usuário", path: route("actions"), permission: "actions.access" },
      { title: "Módulos", path: route("modules"), permission: "modules.access" },
    ],
  },
  {
    title: "Preferências",
    icon: IoMdOptions,
    path: route("preferences"),
  },
];
