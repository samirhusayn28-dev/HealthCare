'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  sublabel?: string
  icon?: React.ReactNode
  badge?: string
}

interface CustomSelectProps {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
  hint?: string
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className,
  hint,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('flex flex-col gap-2 relative', className)} ref={containerRef}>
      {label && (
        <label className="text-xs sm:text-sm font-semibold text-foreground tracking-wide flex items-center justify-between">
          <span>{label}</span>
          {selectedOption?.badge && (
            <span className="text-[10px] bg-primary-50 text-primary-700 font-medium px-2 py-0.5 rounded-full border border-primary-200">
              {selectedOption.badge}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'w-full min-h-[48px] sm:min-h-[52px] px-4 py-3 rounded-xl border bg-white text-left text-sm sm:text-base',
          'flex items-center justify-between gap-3',
          'transition-all duration-200 shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          isOpen
            ? 'border-primary ring-2 ring-primary/20 shadow-elevated'
            : 'border-border hover:border-primary-300 hover:bg-surface-50/50',
          error && 'border-danger focus:ring-danger/20 focus:border-danger'
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {selectedOption?.icon && (
            <div className="flex-shrink-0 text-primary">
              {selectedOption.icon}
            </div>
          )}
          <div className="truncate">
            {selectedOption ? (
              <div className="flex items-center gap-2 truncate">
                <span className="font-medium text-foreground truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.sublabel && (
                  <span className="text-xs text-foreground-muted truncate">
                    &bull; {selectedOption.sublabel}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-foreground-muted/70">{placeholder}</span>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground-muted flex-shrink-0"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            key="custom-select-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 max-h-64 overflow-y-auto bg-white rounded-2xl border border-border/80 shadow-elevated p-1.5 focus:outline-none backdrop-blur-xl"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 text-sm',
                    isSelected
                      ? 'bg-primary-50 text-primary font-semibold'
                      : 'text-foreground hover:bg-surface-100 hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {opt.icon && (
                      <div className={cn('flex-shrink-0', isSelected ? 'text-primary' : 'text-foreground-muted')}>
                        {opt.icon}
                      </div>
                    )}
                    <div className="truncate">
                      <div className="truncate">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-[11px] text-foreground-muted font-normal truncate">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-primary flex-shrink-0">
                      <Check size={16} />
                    </span>
                  )}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs font-medium text-danger flex items-center gap-1.5 mt-0.5" role="alert">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && <p className="text-xs text-foreground-muted">{hint}</p>}
    </div>
  )
}
