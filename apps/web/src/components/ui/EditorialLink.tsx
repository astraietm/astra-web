"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface EditorialLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const EditorialLink: React.FC<EditorialLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-foreground hover:text-amber-600 dark:hover:text-[#DFE104] transition-colors ${className}`}
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full" />
      </span>
      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
    </Link>
  );
};
