import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner tailwind classes (if not already global, but good to have here or import)
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'glass' | 'emerald';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    rounded?: 'default' | 'full' | 'xl';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    rounded = 'default',
    icon,
    iconPosition = 'left',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500',
        outline: 'border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-500',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-500',

        // New Premium Variants
        premium: 'bg-slate-900 text-white premium-button-glow hover:-translate-y-0.5',
        glass: 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm',
        emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
    };

    const roundness = {
        default: 'rounded-md',
        full: 'rounded-full',
        xl: 'rounded-xl',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                roundness[rounded],
                widthClass,
                className
            )}
            {...props}
        >
            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </button>
    );
};
