'use client';

import React, { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      type = 'text',
      name,
      className = '',
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || name || label?.replace(/\s+/g, '-').toLowerCase();

    const baseInput =
      'block w-full border px-4 py-3 text-base bg-white text-[#111214] placeholder:text-[#6B655C]/60 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1';

    const normalBorder =
      'border-[#E7E2D8] focus:border-[#111214] focus:ring-[#111214]/20';

    const errorBorder =
      'border-[#F5333F] focus:border-[#F5333F] focus:ring-[#F5333F]/20';

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#111214]"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-[#F5333F]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          required={required}
          className={`${baseInput} ${error ? errorBorder : normalBorder}`}
          {...rest}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-[#F5333F]"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-[#6B655C]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export type { InputProps };
