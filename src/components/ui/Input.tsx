/**
 * @file src/components/ui/Input.tsx
 * Accessible Form Input with permanent label and WCAG 2.2 error bindings
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, id, className, required, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-800 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500" aria-hidden="true">*</span>}
        </label>

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              'w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500',
              'placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightElement ? 'pr-11' : 'pr-3.5',
              error
                ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400'
                : 'border-slate-300 hover:border-slate-400',
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs font-medium text-rose-600 flex items-center gap-1.5 mt-0.5" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
