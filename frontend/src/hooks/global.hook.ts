import { GlobalContext } from "@/context/global.context";
import { useContext } from "react";

const useGlobalHook = () => {
  const context = useContext(GlobalContext);

  return context;
};

export { useGlobalHook };