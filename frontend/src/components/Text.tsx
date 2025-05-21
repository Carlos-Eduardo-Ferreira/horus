'use client'

import React from 'react'
import { cn } from '@/utils/classNames'

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'left' | 'center' | 'right'
  noDefaultColor?: boolean
}

export default function Text({
  size = 'md',
  align = 'left',
  noDefaultColor = false,
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
        !noDefaultColor && 'color-text',
        className
      )}
      {...rest}
    >
      {children}
    </p>
  )
}