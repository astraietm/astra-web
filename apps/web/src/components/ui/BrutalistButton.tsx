import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface BrutalistButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent-green' | 'accent-magenta' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseStyles =
    'group relative inline-flex items-center justify-center font-mono font-bold uppercase tracking-wider border-2 border-foreground transition-[transform,box-shadow,background-color,border-color,color] duration-160 ease-[var(--ease-out,cubic-bezier(0.23,1,0.32,1))] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
    md: 'px-5 py-2.5 text-sm gap-2 shadow-brutal hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-brutal-sm',
    lg: 'px-7 py-3.5 text-base gap-2.5 shadow-brutal hover:-translate-x-1.5 hover:-translate-y-1.5 hover:shadow-brutal-xl active:translate-x-1 active:translate-y-1 active:shadow-brutal-sm',
  };

  const variantStyles = {
    primary:
      'bg-[#DFE104] text-black hover:bg-[#F2F522] focus-visible:ring-[#DFE104]',
    secondary:
      'bg-surface text-foreground hover:bg-surface-elevated focus-visible:ring-foreground',
    'accent-green':
      'bg-emerald-400 text-black hover:bg-emerald-300 focus-visible:ring-emerald-400',
    'accent-magenta':
      'bg-pink-400 text-black hover:bg-pink-300 focus-visible:ring-pink-400',
    dark:
      'bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-visible:ring-foreground',
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        <span>{children}</span>
        {withArrow && (
          <ArrowUpRight className="w-4 h-4 transition-transform duration-160 ease-[var(--ease-out,cubic-bezier(0.23,1,0.32,1))] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight className="w-4 h-4 transition-transform duration-160 ease-[var(--ease-out,cubic-bezier(0.23,1,0.32,1))] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </button>
  );
};
