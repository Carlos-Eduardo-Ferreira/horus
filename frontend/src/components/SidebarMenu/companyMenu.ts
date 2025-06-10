import { MdDashboard } from "react-icons/md";
import { IMenuSideBarProps } from "./types";
import { IoMdOptions } from "react-icons/io";
import { route } from "@/config/namedRoutes";

export const companyMenu: IMenuSideBarProps[] = [
  {
    title: "Dashboard",
    path: route("companyDashboard"),
    icon: MdDashboard,
  },
  {
    title: "Preferências",
    icon: IoMdOptions,
    path: route("preferences"),
  },
];
