import { MdDashboard } from "react-icons/md";
import { IMenuSideBarProps } from "./types";
import { IoMdOptions } from "react-icons/io";
import { route } from "@/config/namedRoutes";

export const consumerMenu: IMenuSideBarProps[] = [
  {
    title: "Dashboard",
    path: route('consumerDashboard'),
    icon: MdDashboard,
  },
  {
    title: "Preferências",
    icon: IoMdOptions,
    path: route('preferences'),
  },
];
