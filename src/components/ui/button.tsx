import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Enabled / Hover / Disabled = three distinct colors
        default:
          'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary-hover))] active:scale-[0.98] disabled:bg-[hsl(var(--btn-disabled))] disabled:text-[hsl(var(--btn-disabled-foreground))] disabled:shadow-none',
        destructive:
          'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-sm hover:bg-[hsl(var(--destructive-hover))] disabled:bg-[hsl(var(--btn-disabled))] disabled:text-[hsl(var(--btn-disabled-foreground))] disabled:shadow-none',
        outline:
          'border border-input bg-background text-foreground shadow-sm hover:bg-[hsl(var(--primary-hover))] hover:text-[hsl(var(--primary-foreground))] hover:border-[hsl(var(--primary-hover))] disabled:bg-[hsl(var(--btn-disabled))] disabled:text-[hsl(var(--btn-disabled-foreground))] disabled:border-transparent',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] disabled:bg-[hsl(var(--btn-disabled))] disabled:text-[hsl(var(--btn-disabled-foreground))]',
        ghost:
          'text-foreground hover:bg-[hsl(var(--primary)/0.12)] hover:text-[hsl(var(--primary))] disabled:text-[hsl(var(--btn-disabled-foreground))] disabled:bg-transparent',
        link: 'text-[hsl(var(--primary))] underline-offset-4 hover:text-[hsl(var(--primary-hover))] hover:underline disabled:text-[hsl(var(--btn-disabled-foreground))] disabled:no-underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
