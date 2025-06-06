import React from 'react';
import { IconProps } from '@phosphor-icons/react';
import { cn } from '@/utils/classNames';

type ActionButtonColors = 'primary' | 'danger' | 'warning' | 'success' | 'secondary';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ForwardRefExoticComponent<IconProps>;
  color: ActionButtonColors;
}

const colorVariants = {
  primary: {
    background: 'bg-blue-50 hover:bg-blue-100',
    icon: 'text-blue-600',
  },
  danger: {
    background: 'bg-red-50 hover:bg-red-100',
    icon: 'text-red-600',
  },
  warning: {
    background: 'bg-yellow-50 hover:bg-yellow-100',
    icon: 'text-yellow-600',
  },
  success: {
    background: 'bg-green-50 hover:bg-green-100',
    icon: 'text-green-600',
  },
  secondary: {
    background: 'bg-gray-300 hover:bg-gray-400',
    icon: 'text-gray-900',
  },
};

export default function ActionButton({ 
  icon: Icon, 
  color, 
  className,
  disabled,
  ...props 
}: ActionButtonProps) {
  const colors = colorVariants[color];

  return (
    <button
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer', 
        colors.background,
        className
      )}
      disabled={disabled}
      {...props}
    >
      <Icon className={cn('w-4 h-4', colors.icon)} weight="bold" />
    </button>
  );
}
