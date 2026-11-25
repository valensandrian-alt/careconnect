/**
 * @file src/components/ui/Button.tsx
 * Accessible button component complying with WCAG 2.2 AA (min 44px touch target)
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] select-none disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap cursor-pointer';

    const sizeStyles = {
      sm: 'min-h-[44px] px-3.5 py-2 text-xs gap-1.5',
      md: 'min-h-[44px] px-5 py-2.5 text-sm gap-2',
      lg: 'min-h-[48px] px-6 py-3 text-base gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 focus-visible:outline-teal-600 shadow-sm shadow-teal-700/20',
      secondary:
        'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 focus-visible:outline-slate-900 shadow-sm',
      outline:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-teal-600',
      ghost:
        'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-teal-600',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:outline-rose-600 shadow-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
