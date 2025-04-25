'use client'
import React from 'react'
import { cn } from '@/lib/utils'

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Tamanho do link */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function TextLink({
  size = 'md',
  className,
  children,
  ...rest
}: TextLinkProps) {
  const sizeClass = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size]

  return (
    <a
      className={cn(
        sizeClass,
        'underline decoration-current transition-opacity',
        'text-[var(--link-color)] hover:text-[var(--link-hover)]',
        className
      )}
      {...rest}
    >
      {children}
    </a>
  )
}
