'use client'

import React from 'react'
import { cn } from '@/utils/classNames'

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'left' | 'center' | 'right'
}

export default function Title({
  size = 'md',
  align = 'center',
  className,
  children,
  ...rest
}: TitleProps) {
  const sizeClass = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }[size]

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]

  return (
    <h2
      className={cn(
        sizeClass,
        'font-bold',
        alignClass,
        'text-gray-900',
        className
      )}
      {...rest}
    >
      {children}
    </h2>
  )
}