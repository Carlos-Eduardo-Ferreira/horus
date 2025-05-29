'use client';

import { ConfirmModal } from "@/components/ConfirmModal";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GoSignOut, GoPerson, GoQuestion } from "react-icons/go";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { authService } from "@/services/auth";
import { getRoleLabel } from "../../utils/roleLabels";

interface IUser {
  name: string;
  role: string;
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
  const [user, setUser] = useState<IUser>({ name: '', email: '', role: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number>(260);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser({ name: '', email: '', role: '' });
        return;
      }
      try {
        const userData = await authService.getCurrentUser(token);
        if (userData && typeof userData === 'object' && 'user' in userData) {
          setUser(userData.user as IUser);
        } else {
          setUser({ name: '', email: '', role: '' });
        }
      } catch {
        setUser({ name: '', email: '', role: '' });
      }
    };
    fetchUser();
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
    setShowLogout((prev) => !prev);
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await authService.logout(token);
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        className="flex cursor-pointer"
        onClick={() => setIsMenuOpen((prev) => !prev)}
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
          <span className="text-md font-bold">{user?.name || "Usuário"}</span>
          <span className="text-sm">{getRoleLabel(user.role)}</span>
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