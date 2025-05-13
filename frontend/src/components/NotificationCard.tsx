"use client";

import { getTime } from "@/utils/getTime";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineArrowUturnLeft } from "react-icons/hi2";
import { RxDotsVertical } from "react-icons/rx";
import Text from "@/components/Text";

type NotificationProps = {
  title: string;
  message: string;
  date: Date;
  isRead?: boolean;
};

const NotificationCard = ({
  title,
  message,
  date,
  isRead,
}: NotificationProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleToggleOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`flex relative items-center w-full gap-2 h-full justify-between bg-hover-primary-soft cursor-pointer px-4 ${
        isRead ? "bg-white" : "bg-gray-200"
      }`}    
      onClick={() => setShowOptions(false)}
    >
      <div className="flex p-4 gap-2 items-center">
        <div
          className={`relative w-12 h-12 flex items-center justify-center rounded-full ${
            isRead
              ? "bg-gray-200 text-gray-500"
              : "bg-primary color-primary"
          }`}
        >
          <HiOutlineArrowUturnLeft size={20} />
          {!isRead && (
            <FaCircle className="absolute bottom-1 right-0" size={10} />
          )}
        </div>
      </div>
      <div className="flex w-full flex-col justify-between flex-wrap">
        <Text size="sm" className="font-bold">
          {title}
        </Text>
        <Text size="xs">
          {message}
        </Text>
      </div>
      <div className="flex items-center h-20 py-4 mr-2">
        <div className="flex h-full justify-between w-16 gap-2 flex-col items-end">
          <Text size="xs" className="w-full text-right">
            {getTime(date)}
          </Text>

          <button
            className="text-gray-600 hover:text-gray-700 pr-2 cursor-pointer"
            onClick={handleToggleOptions}
          >
            <RxDotsVertical size={24} />
          </button>
        </div>
        <AnimatePresence>
          {showOptions && (
            <motion.div
              className="flex w-full items-end justify-end absolute inset-0 z-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="flex w-20 items-center justify-center bg-red-500 hover:bg-red-700 text-white h-20 transition-colors duration-200 cursor-pointer"
                onClick={handleDeleteClick}
              >
                <FiTrash2 size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { NotificationCard };