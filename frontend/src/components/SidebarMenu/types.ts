import { IconType } from "react-icons";

export type IMenuSideBarProps = {
  title: string;
  path?: string;
  icon?: IconType;
  subMenu?: boolean;
  subMenuItems?: IMenuSideBarProps[];
};
