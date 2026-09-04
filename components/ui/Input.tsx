import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type InputSize = 'sm' | 'md' | 'lg'

interface BaseInputProps {
  label?: string
  error?: string
  hint?: string
  inputSize?: InputSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface InputProps
  extends BaseInputProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {}

export interface TextareaProps
  extends BaseInputProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number
}

export interface SelectProps
  extends BaseInputProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
}

const inputSizeClasses: Record<InputSize, string> = {
  sm: 'h-9 text-xs sm:text-sm px-3.5 rounded-lg',
  md: 'min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-4 rounded-xl',
  lg: 'min-h-[56px] text-base px-5 rounded-xl',
}

const baseInputClasses =
  'w-full rounded-xl border bg-white text-foreground placeholder:text-foreground-muted/70 ' +
  'transition-all duration-200 shadow-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'border-border hover:border-primary-300'

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    inputSize = 'md',
    leftIcon,
    rightIcon,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-foreground tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none transition-colors">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            baseInputClasses,
            inputSizeClasses[inputSize],
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-danger focus:ring-danger/20 focus:border-danger',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-danger flex items-center gap-1.5 mt-0.5" role="alert">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-foreground-muted">
          {hint}
        </p>
      )}
    </div>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, inputSize = "md", className, id, rows = 4, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-foreground tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          baseInputClasses,
          'p-4 resize-none text-sm sm:text-base leading-relaxed',
          error && 'border-danger focus:ring-danger/20 focus:border-danger',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-danger flex items-center gap-1.5 mt-0.5" role="alert">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-foreground-muted">
          {hint}
        </p>
      )}
    </div>
  )
})

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, inputSize = "md", options, placeholder, className, id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          baseInputClasses,
          inputSizeClasses[inputSize],
          'appearance-none cursor-pointer',
          error && 'border-danger focus:ring-danger focus:border-danger',
          className
        )}
        aria-invalid={!!error}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-foreground-muted">
          {hint}
        </p>
      )}
    </div>
  )
})
