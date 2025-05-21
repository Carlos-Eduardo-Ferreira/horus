import React from 'react';
import { IconType } from 'react-icons';
import Text from './Text';
import { cn } from '@/utils/classNames';

type AlertVariant = 'primary' | 'danger' | 'warning' | 'success';

interface AlertProps {
  children: React.ReactNode;
  icon?: IconType;
  variant?: AlertVariant;
}

const variants: Record<AlertVariant, { border: string; bg: string; text: string }> = {
  primary: {
    border: 'border-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-400',
  },
  danger: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    text: 'text-red-400',
  },
  warning: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-400',
  },
  success: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    text: 'text-green-400',
  },
};

export default function Alert({ children, icon: Icon, variant = 'primary' }: AlertProps) {
  const colors = variants[variant];

  return (
    <div
      className={cn(
        'flex items-center p-4 border-t-4 rounded-md',
        colors.bg,
        colors.border,
        colors.text
      )}
      role="alert"
    >
      {Icon && <Icon className="shrink-0 w-5 h-5" />}
      <div className={cn('ms-3', !Icon && 'ms-0')}>
        <Text size="sm" className={cn('font-medium', colors.text)} noDefaultColor>
          {children}
        </Text>
      </div>
    </div>
  );
}
