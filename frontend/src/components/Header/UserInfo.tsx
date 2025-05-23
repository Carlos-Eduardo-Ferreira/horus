'use client'

import { ConfirmModal } from "@/components/ConfirmModal";
import { AnimatePresence, motion } from "framer-motion";
import { getSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GoSignOut, GoPerson, GoQuestion } from "react-icons/go";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface IUser {
  name: string;
  role?: string;
  email: string;
  image?: string;
}

interface ILink {
  id: number;
  name: string;
  href: string;
  icon: React.ReactNode;
}

const links: ILink[] = [
  {
    id: 1,
    name: "Perfil",
    href: "#",
    icon: <GoPerson className="w-4 h-4" />
  },
  {
    id: 2,
    name: "Suporte",
    href: "#",
    icon: <GoQuestion className="w-4 h-4" />
  },
];

const UserInfo = () => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number>(260);
  const [showLogout, setShowLogout] = useState(false);

  const handleGetSession = async () => {
    const session = await getSession();

    if (!session) {
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 2000);
    }

    setUser(session?.user as IUser);
  };

  useEffect(() => {
    handleGetSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setMenuWidth(width);
    }
  }, [isMenuOpen]);

  const handleShowLogout = () => {
    setIsMenuOpen(false);
    setShowLogout(!showLogout);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const UserRoleFormatted = (user?: IUser) => {
    switch (user?.role) {
      case "u":
        return "User";
      case "m":
        return "Master";
      default:
        return "Cargo";
    }
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        className="flex cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {user?.image ? (
          <div className="w-[42px] h-[42px] rounded-full overflow-hidden mr-2 md:mr-4">
            <Image src={user.image} alt={user.name} width={42} height={42} />
          </div>
        ) : (
          <div className="w-[42px] h-[42px] rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white mr-2 md:mr-4">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div className="flex flex-col mr-2 md:mr-8">
          <span className="text-md font-bold">{user?.name ?? "Usuário"}</span>
          <span className="text-sm">{UserRoleFormatted(user)}</span>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 mt-4 bg-white shadow-lg rounded-lg overflow-hidden z-40"
            style={{ width: menuWidth }}
          >
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="flex items-center gap-2 ps-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-primary"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            <button
              onClick={handleShowLogout}
              
              className="flex items-center w-full ps-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-primary cursor-pointer gap-2"
            >
              <GoSignOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        show={showLogout}
        onClose={() => setShowLogout(false)}
        onOk={handleSignOut}
        confirmLoading={false}
        title="Deseja realmente sair?"
        description="Você será desconectado da aplicação."
        confirmText="Sair"
        cancelText="Cancelar"
        icon={<ExclamationTriangleIcon className="w-20 h-20 text-red-500" />}
      />
    </div>
  );
};

export { UserInfo };