'use client'

import React from 'react'
import { cn } from '@/utils/classNames'

export interface LabeledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string
  error?: string
  mutedBackground?: boolean
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
  error,
  mutedBackground = false,
  disabled,
  ...rest
}: LabeledInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }

  const labelBackground = mutedBackground ? 'bg-muted' : 'bg-common';

  return (
    <div className="relative flex flex-col gap-1">
      <input
        id={id}
        type={type}
        tabIndex={tabIndex}
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        className={cn(
          'w-full px-4 h-11 flex items-center transition-all',
          'rounded-xl',
          'border',
          'shadow-md',
          'text-gray-700',
          'focus:outline-none',
          error ? 'border-red-500' : 'border-gray-300',
          error
            ? 'focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'focus:border-gray-600 focus:ring-1 focus:ring-gray-600',
          disabled 
            ? 'bg-gray-50 cursor-not-allowed shadow-sm border-gray-200 hover:border-gray-200'
            : 'bg-white hover:-translate-y-[1px] transform transition-transform duration-200 cursor-text',
          className
        )}
        style={{ paddingTop: 0, paddingBottom: 0 }}
        {...rest}
      />

      <div className="absolute left-4 -top-3 pointer-events-none">
        <div className="relative">
          <div className={cn(
            "absolute inset-0 top-1/2 h-1/2",
            disabled ? "bg-gray-50" : "bg-white"
          )} />
          <div className={`absolute inset-0 bottom-1/2 h-1/2 ${labelBackground}`} />
          <span className="relative px-1 text-sm text-gray-600">
            {title}
          </span>
        </div>
      </div>

      {error && (
        <span className="text-xs text-red-500 ml-1">{error}</span>
      )}
    </div>
  )
}