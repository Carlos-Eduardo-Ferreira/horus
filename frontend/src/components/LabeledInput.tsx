'use client'

import React from 'react'
import { cn } from '@/lib/classNames'

export interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Texto que aparece “flutuando” acima do input */
  title: string
}

export default function LabeledInput({
  id,
  title,
  type = 'text',
  defaultValue,
  value,
  onChange,
  className,
  tabIndex,
  ...rest
}: LabeledInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        tabIndex={tabIndex}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        className={cn(
          'w-full px-4 h-11 flex items-center transition-all',
          'rounded-xl',
          'bg-[var(--labeled-input-bg)]',
          'border border-gray-300',
          'shadow-md',
          'hover:-translate-y-[1px]',
          'text-[var(--labeled-input-text)]',
          'focus:outline-none',
          'focus:border-[var(--labeled-input-focus)]',
          'focus:ring-1 focus:ring-[var(--labeled-input-focus)]',
          'transform transition-transform duration-200',
          className
        )}
        style={{ paddingTop: 0, paddingBottom: 0 }}
        {...rest}
      />

      {/* Label “flutuante” */}
      <div className="absolute left-4 -top-3 pointer-events-none">
        <div className="relative">
          {/* Topo: fundo do input */}
          <div className="absolute inset-0 top-1/2 h-1/2 bg-[var(--labeled-input-bg)]" />
          {/* Base: fundo do form de autenticação */}
          <div className="absolute inset-0 bottom-1/2 h-1/2 bg-[var(--auth-form-background)]" />
          <span className="relative px-1 text-sm text-[var(--labeled-text)]">
            {title}
          </span>
        </div>
      </div>
    </div>
  )
}
