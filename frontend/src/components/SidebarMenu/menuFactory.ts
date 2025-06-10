import { adminMenu } from "./adminMenu";
import { companyMenu } from "./companyMenu";
import { consumerMenu } from "./consumerMenu";
import { IMenuSideBarProps } from "./types";

export function getMenuByRole(role: string): IMenuSideBarProps[] {
  switch (role) {
    case "master":
    case "admin":
    case "user":
      return adminMenu;
    case "company":
      return companyMenu;
    case "consumer":
      return consumerMenu;
    default:
      return [];
  }
}
