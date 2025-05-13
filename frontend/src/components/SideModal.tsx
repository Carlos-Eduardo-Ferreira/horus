import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { FaX } from 'react-icons/fa6';
import Title from './Title';

interface ISideModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  fullScreenOnMobile?: boolean;
}

const SideModal = ({ 
  title, 
  isOpen, 
  onClose, 
  children,
  fullScreenOnMobile = false
}: ISideModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (backdropRef.current && event.target === backdropRef.current) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.15 },
    },
  };

  const desktopModalVariants = {
    hidden: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      x: '0%',
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const mobileModalVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const getModalClasses = () => {
    if (isMobile && fullScreenOnMobile) {
      return "bg-white w-full h-full shadow-lg py-6";
    }
    
    return "bg-white w-1/3 max-w-[460px] h-full shadow-lg py-6 max-sm:w-full max-md:w-3/4 max-lg:w-3/4 max-xl:w-4/5";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          className="fixed inset-0 bg-black/30 flex justify-end z-50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className={getModalClasses()}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={isMobile && fullScreenOnMobile ? mobileModalVariants : desktopModalVariants}
          >
            <div className="flex items-center justify-between border-b text-lg border-gray-200 pb-4 px-6">
              <Title size="sm" align="left">
                {title}
              </Title>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={onClose}
              >
                <FaX />
              </button>
            </div>
            <div className="h-full overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { SideModal };