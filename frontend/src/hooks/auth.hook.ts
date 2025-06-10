import { useAuthContext } from "@/context/auth.context";

const useAuthHook = () => {
  return useAuthContext();
};

export { useAuthHook };
