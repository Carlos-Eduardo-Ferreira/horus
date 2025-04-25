'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Tamanho do link */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Variante do link */
  variant?: 'primary' | 'secondary'
  /** Tempo de debounce em milissegundos para prevenir duplo clique */
  debounceTime?: number
}

export default function TextLink({
  size = 'md',
  variant = 'primary',
  className,
  children,
  onClick,
  href,
  debounceTime = 500, // Default de 500ms para evitar duplo clique
  ...rest
}: TextLinkProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isClicked) return;
    
    setIsClicked(true);
    
    // Reativar o link após o período de debounce
    setTimeout(() => {
      setIsClicked(false);
    }, debounceTime);
    
    // Executa o onClick original se existir
    if (onClick) {
      onClick(e);
    }
  };

  const sizeClass = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }[size]

  const variantClass = {
    primary: 'text-[var(--link-color)] hover:text-[var(--link-hover)]',
    secondary: 'text-[var(--text-color)] hover:text-[var(--link-color)]'
  }[variant]

  // Se temos onClick mas não temos href, precisamos garantir que o cursor seja pointer
  const needsPointer = onClick && !href;

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
