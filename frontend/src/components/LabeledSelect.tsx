'use client'

import React from 'react'
import { cn } from '@/utils/classNames'

export interface SelectOption {
  value: string
  label: string
}

export interface LabeledSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  title: string
  options: SelectOption[]
  error?: string
  mutedBackground?: boolean
  placeholder?: string
  onChange?: (value: string) => void
}

export default function LabeledSelect({
  id,
  title,
  options,
  value,
  onChange,
  className,
  tabIndex,
  error,
  mutedBackground = false,
  placeholder,
  ...rest
}: LabeledSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  }

  const labelBackground = mutedBackground ? 'bg-muted' : 'bg-common';

  return (
    <div className="relative flex flex-col gap-1">
      <select
        id={id}
        tabIndex={tabIndex}
        value={value || ""}
        onChange={handleChange}
        className={cn(
          'w-full px-4 h-11 flex items-center transition-all',
          'rounded-xl',
          'bg-white',
          'border',
          error ? 'border-red-500' : 'border-gray-300',
          'shadow-md',
          'hover:-translate-y-[1px]',
          'focus:outline-none',
          error
            ? 'focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'focus:border-gray-600 focus:ring-1 focus:ring-gray-600',
          'transform transition-transform duration-200',
          'appearance-none',
          'cursor-pointer',
          value ? 'text-gray-700' : 'text-gray-400',
          className
        )}
        {...rest}
      >
        <option value="" disabled className="text-gray-400">
          {placeholder || "Selecione..."}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-700">
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom arrow */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div className="absolute left-4 -top-3 pointer-events-none">
        <div className="relative">
          <div className="absolute inset-0 top-1/2 h-1/2 bg-white" />
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
