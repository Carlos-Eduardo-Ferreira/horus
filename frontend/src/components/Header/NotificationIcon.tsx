"use client";

import { NotificationCard } from "@/components/NotificationCard";
import { SideModal } from "@/components/SideModal";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LuBell } from "react-icons/lu";
import TextLink from '@/components/TextLink'
import Title from "../Title";
import { Notification, notificationsData } from "./notificationsData";

const NotificationIcon = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleDropdown = () => {
    if (isMobile) {
      // No mobile, abrir diretamente o modal de todas as notificações
      setShowAllNotifications(true);
    } else {
      // No desktop, mostrar dropdown normal
      setShowDropdown(!showDropdown);
    }
  };

  useEffect(() => {
    const firstFiveNotifications = notificationsData.slice(0, 5);

    setNotifications(firstFiveNotifications);

    const unreadNotifications = notificationsData.filter(
      (notification) => !notification.isRead
    );

    setHasNotifications(unreadNotifications.length > 0);
    
    // Fechar o dropdown quando mudar para mobile
    if (isMobile) {
      setShowDropdown(false);
    }
  }, [isMobile]);

  const handleOpenAllNotifications = () => {
    setShowDropdown(false);
    setShowAllNotifications(true);
  };

  useEffect(() => {
    // Fechar dropdown ao clicar fora dele
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mr-2 md:mr-6" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="relative cursor-pointer group">
        <LuBell className="w-6 h-6 text-gray-600 group-hover:color-primary" />
        {hasNotifications && (
          <span className="absolute top-0 right-0 w-[8px] h-[8px] bg-primary-strong rounded-full"></span>
        )}
      </div>
      <AnimatePresence>
        {showDropdown && !isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 mt-4 w-[460px] bg-white shadow-lg rounded-lg overflow-hidden z-40"
          >
            <div>
              <Title size="sm" align="left" className="p-3">
                Notificações
              </Title>
            </div>
            <div className="">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  title={notification.title}
                  message={notification.message}
                  date={notification.date}
                  isRead={notification.isRead}
                />
              ))}
            </div>

            <div className="flex w-full items-center justify-center p-4">
              <TextLink
                onClick={() => handleOpenAllNotifications()}
                size="md"
                variant="primary"
                className="no-underline"
              >
                Ver todas as notificações
              </TextLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SideModal
        isOpen={showAllNotifications}
        onClose={() => setShowAllNotifications(false)}
        title="Notificações"
        fullScreenOnMobile={true}
      >
        <div className="">
          {notificationsData.map((notification) => (
            <NotificationCard
              key={notification.id}
              title={notification.title}
              message={notification.message}
              date={notification.date}
              isRead={notification.isRead}
            />
          ))}
        </div>
      </SideModal>
    </div>
  );
};

export { NotificationIcon };
