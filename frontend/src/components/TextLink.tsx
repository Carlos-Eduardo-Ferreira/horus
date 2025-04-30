'use client'

import React, { useState } from 'react'
import { cn } from '@/utils/classNames'

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary'
  debounceTime?: number
}

export default function TextLink({
  size = 'md',
  variant = 'primary',
  className,
  children,
  onClick,
  href,
  debounceTime = 500,
  ...rest
}: TextLinkProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isClicked) return
    
    setIsClicked(true)
    
    setTimeout(() => {
      setIsClicked(false)
    }, debounceTime)
    
    if (onClick) {
      onClick(e)
    }
  }

  const sizeClass = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size]

  const variantClass = {
    primary: 'text-indigo-500 hover:text-indigo-600',
    secondary: 'text-gray-700 hover:text-indigo-500'
  }[variant]

  const needsPointer = onClick && !href

  return (
    <a
      className={cn(
        sizeClass,
        'underline decoration-current transition-opacity',
        variantClass,
        isClicked && 'opacity-70 pointer-events-none',
        needsPointer && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      aria-disabled={isClicked}
      role={needsPointer ? "button" : undefined}
      tabIndex={needsPointer ? 0 : undefined}
      href={href}
      {...rest}
    >
      {children}
    </a>
  )
}