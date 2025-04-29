'use client'

import React from 'react'
import { cn } from '@/lib/classNames'

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'left' | 'center' | 'right'
}

export default function Text({
  size = 'md',
  align = 'left',
  className,
  children,
  ...rest
}: TextProps) {
  const sizeClass = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size]

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]

  return (
    <p
      className={cn(
        sizeClass,
        alignClass,
        'text-gray-900',
        className
      )}
      {...rest}
    >
      {children}
    </p>
  )
}