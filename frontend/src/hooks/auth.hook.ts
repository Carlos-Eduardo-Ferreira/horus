import { AuthContext } from "@/context/auth.context";
import { useContext } from "react";

const useAuthHook = () => {
  const context = useContext(AuthContext);

  return context;
};

export { useAuthHook };
