'use client'
import React from 'react'
import { cn } from '@/lib/utils'

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
  /** Variante de cor do botão */
  variant?: ButtonVariant
  /** Usa estilo outline */
  outline?: boolean
}

export default function Button({
  variant = 'primary',
  outline = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center px-4 py-2',
    'border-2 rounded-xl font-medium cursor-pointer',
    'transition-colors transform transition-transform duration-200',
    'shadow-md hover:-translate-y-[1px]',
  );

  const filledStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--btn-primary-border)] hover:bg-[var(--btn-primary-hover)]',
    secondary: 'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-[var(--btn-secondary-border)] hover:bg-[var(--btn-secondary-hover)]',
    success: 'bg-[var(--btn-success-bg)] text-[var(--btn-success-text)] border-[var(--btn-success-border)] hover:bg-[var(--btn-success-hover)]',
    danger: 'bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] border-[var(--btn-danger-border)] hover:bg-[var(--btn-danger-hover)]',
    warning: 'bg-[var(--btn-warning-bg)] text-[var(--btn-warning-text)] border-[var(--btn-warning-border)] hover:bg-[var(--btn-warning-hover)]',
    info: 'bg-[var(--btn-info-bg)] text-[var(--btn-info-text)] border-[var(--btn-info-border)] hover:bg-[var(--btn-info-hover)]',
    light: 'bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] border-[var(--btn-light-border)] hover:bg-[var(--btn-light-hover)]',
    dark: 'bg-[var(--btn-dark-bg)] text-[var(--btn-dark-text)] border-[var(--btn-dark-border)] hover:bg-[var(--btn-dark-hover)]',
  }

  const outlineStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[var(--labeled-input-bg)] text-[var(--btn-primary-bg)] border-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)]',
    secondary: 'bg-[var(--labeled-input-bg)] text-[var(--btn-secondary-bg)] border-[var(--btn-secondary-bg)] hover:bg-[var(--btn-secondary-bg)] hover:text-[var(--btn-secondary-text)]',
    success: 'bg-[var(--labeled-input-bg)] text-[var(--btn-success-bg)] border-[var(--btn-success-bg)] hover:bg-[var(--btn-success-bg)] hover:text-[var(--btn-success-text)]',
    danger: 'bg-[var(--labeled-input-bg)] text-[var(--btn-danger-bg)] border-[var(--btn-danger-bg)] hover:bg-[var(--btn-danger-bg)] hover:text-[var(--btn-danger-text)]',
    warning: 'bg-[var(--labeled-input-bg)] text-[var(--btn-warning-bg)] border-[var(--btn-warning-bg)] hover:bg-[var(--btn-warning-bg)] hover:text-[var(--btn-warning-text)]',
    info: 'bg-[var(--labeled-input-bg)] text-[var(--btn-info-bg)] border-[var(--btn-info-bg)] hover:bg-[var(--btn-info-bg)] hover:text-[var(--btn-info-text)]',
    light: 'bg-[var(--labeled-input-bg)] text-[var(--btn-light-bg)] border-[var(--btn-light-bg)] hover:bg-[var(--btn-light-bg)] hover:text-[var(--btn-light-text)]',
    dark: 'bg-[var(--labeled-input-bg)] text-[var(--btn-dark-bg)] border-[var(--btn-dark-bg)] hover:bg-[var(--btn-dark-bg)] hover:text-[var(--btn-dark-text)]',
  }

  const style = outline ? outlineStyles[variant] : filledStyles[variant]

  return (
    <button
      className={cn(base, style, className)}
      {...rest}
    >
      {children}
    </button>
  )
}