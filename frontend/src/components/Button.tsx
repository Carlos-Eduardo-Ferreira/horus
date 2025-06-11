'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/utils/classNames'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  outline?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  buttonType?: 'regular' | 'compact'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  outline = false,
  className,
  children,
  href,
  disabled = false,
  type = 'button',
  buttonType = 'regular',
  onClick,
  ...rest
}, ref) => {

  const base = cn(
    'inline-flex items-center justify-center px-4',
    buttonType === 'regular' ? 'py-2 rounded-xl' : 'py-0 h-10 rounded-md',
    'border-2 font-medium cursor-pointer',
    'transition-colors transform duration-200 ease-in-out will-change-transform',
    variant === 'light' ? 'shadow-sm hover:-translate-y-[1px]' : 'shadow-md hover:-translate-y-[1px]',
    'active:translate-y-0 active:shadow-sm',
    disabled && 'opacity-70 cursor-not-allowed'
  )

  const filledStyles: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-400 text-white border-indigo-400 hover:bg-indigo-500 hover:border-indigo-500',
    secondary: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700',
    success: 'bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600',
    danger: 'bg-red-400 text-white border-red-400 hover:bg-red-500 hover:border-red-500',
    warning: 'bg-amber-400 text-gray-700 border-amber-400 hover:bg-yellow-500 hover:border-yellow-500',
    info: 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700 hover:border-cyan-700',
    light: 'bg-gray-100 color-text border-gray-100 hover:bg-gray-200 hover:border-gray-200',
  }

  const outlineStyles: Record<ButtonVariant, string> = {
    primary: 'bg-white text-indigo-400 border-indigo-400 hover:bg-indigo-400 hover:text-white',
    secondary: 'bg-white text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white',
    success: 'bg-white text-green-500 border-green-500 hover:bg-green-500 hover:text-white',
    danger: 'bg-white text-red-400 border-red-400 hover:bg-red-400 hover:text-white',
    warning: 'bg-white text-yellow-500 border-amber-400 hover:bg-amber-400 hover:text-gray-700',
    info: 'bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-gray-700',
    light: 'bg-white color-text border-gray-200 hover:bg-gray-100 hover:border-gray-100',
  }

  const style = outline ? outlineStyles[variant] : filledStyles[variant]

  if (href) {
    return (
      <Link
        href={href}
        className={cn(base, style, className)}
        aria-disabled={disabled}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, style, className)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button';

export default Button