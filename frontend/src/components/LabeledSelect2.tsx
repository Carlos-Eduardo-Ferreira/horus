'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/classNames'

export interface SelectOption {
  value: string
  label: string
}

export interface LabeledSelect2Props {
  title: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  tabIndex?: number
  error?: string
  mutedBackground?: boolean
  placeholder?: string
  searchable?: boolean
}

export default function LabeledSelect2({
  title,
  options,
  value,
  onChange,
  className,
  tabIndex,
  error,
  mutedBackground = false,
  placeholder = "Selecione...",
  searchable = true,
}: LabeledSelect2Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = `listbox-${Math.random().toString(36).substr(2, 9)}`

  const selectedOption = options.find(opt => opt.value === value)
  const labelBackground = mutedBackground ? 'bg-muted' : 'bg-common'

  useEffect(() => {
    if (searchable) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [searchTerm, options, searchable])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && searchable) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      <div
        className={cn(
          'w-full px-4 h-11 flex items-center justify-between transition-all cursor-pointer',
          'rounded-xl',
          'bg-white',
          'border',
          error ? 'border-red-500' : 'border-gray-300',
          'shadow-md',
          'hover:-translate-y-[1px]',
          'text-gray-700',
          'focus-within:outline-none',
          error
            ? 'focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
            : 'focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600',
          'transform transition-transform duration-200',
          className
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={tabIndex}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
      >
        <span className={cn(
          'flex-1 truncate',
          !selectedOption && 'text-gray-400'
        )}>
          {selectedOption?.label || placeholder}
        </span>
        
        <svg
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
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

      {isOpen && (
        <div 
          id={listboxId}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden"
          role="listbox"
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              />
            </div>
          )}
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Nenhuma opção encontrada
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 transition-colors',
                    option.value === value && 'bg-gray-50 font-medium'
                  )}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
