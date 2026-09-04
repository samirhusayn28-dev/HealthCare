import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  narrow?: boolean
}

export function Container({
  children,
  className,
  as: Component = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-7xl',
        className
      )}
    >
      {children}
    </Component>
  )
}
