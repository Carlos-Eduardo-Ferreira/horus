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
    subMenuItems: [
      { title: "Usuários", path: route("users") },
      { title: "Unidades Locais", path: route("localUnits") },
      { title: "Ações de Usuário", path: route("actions") },
      { title: "Módulos", path: route("modules") },
    ],
  },
  {
    title: "Preferências",
    icon: IoMdOptions,
    path: route("preferences"),
  },
];
