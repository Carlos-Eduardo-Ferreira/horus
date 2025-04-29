'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/classNames'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  outline?: boolean
  href?: string
}

export default function Button({
  variant = 'primary',
  outline = false,
  className,
  children,
  href,
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {

  const base = cn(
    'inline-flex items-center justify-center px-4 py-2',
    'border-2 rounded-xl font-medium cursor-pointer',
    'transition-colors transform duration-200 ease-in-out',
    'shadow-md hover:-translate-y-[1px]',
    'active:translate-y-0 active:shadow-sm',
    disabled && 'opacity-70 cursor-not-allowed'
  )

  const filledStyles: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600',
    secondary: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700',
    success: 'bg-green-600 text-white border-green-600 hover:bg-green-700',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
    warning: 'bg-yellow-500 text-gray-900 border-yellow-500 hover:bg-yellow-600',
    info: 'bg-cyan-500 text-gray-900 border-cyan-500 hover:bg-cyan-600',
    light: 'bg-gray-100 text-gray-900 border-gray-100 hover:bg-gray-200',
    dark: 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800',
  }

  const outlineStyles: Record<ButtonVariant, string> = {
    primary: 'bg-white text-indigo-500 border-indigo-500 hover:bg-indigo-500 hover:text-white',
    secondary: 'bg-white text-gray-600 border-gray-600 hover:bg-gray-600 hover:text-white',
    success: 'bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white',
    danger: 'bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white',
    warning: 'bg-white text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-gray-900',
    info: 'bg-white text-cyan-500 border-cyan-500 hover:bg-cyan-500 hover:text-gray-900',
    light: 'bg-white text-gray-100 border-gray-100 hover:bg-gray-100 hover:text-gray-900',
    dark: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white',
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
      type={type}
      className={cn(base, style, className)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}