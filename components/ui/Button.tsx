'use client'

import { forwardRef } from 'react'
import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  secondary:
    'bg-accent text-white hover:bg-accent-700 active:bg-accent-800 shadow-sm hover:shadow focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  outline:
    'border border-primary text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  ghost:
    'text-foreground-secondary bg-transparent hover:bg-surface-100 active:bg-surface-200 focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-7 text-base gap-2.5 font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    onClick,
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-button',
        'transition-colors duration-200',
        'focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </motion.button>
  )
})
