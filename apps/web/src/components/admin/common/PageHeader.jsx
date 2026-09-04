import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = ({ 
    title, 
    subtitle, 
    breadcrumbs = [], 
    actions = null,
    badge = null 
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] mb-8">
            <div className="space-y-1.5">
                {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <ChevronRight size={12} className="text-slate-600" />}
                                {crumb.to ? (
                                    <Link to={crumb.to} className="hover:text-slate-200 transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-slate-300 font-semibold">{crumb.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                        {title}
                    </h1>
                    {badge && (
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {badge}
                        </span>
                    )}
                </div>

                {subtitle && (
                    <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-2.5 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
