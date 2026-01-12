import React from 'react';

const EventTimeline = ({ selectedYear, onYearChange }) => {
    const years = ['2023', '2024', '2025', '2026'];
    const currentYear = '2026';

    return (
        <div className="w-full flex justify-center py-12 sticky top-[80px] z-40 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5">
            <div className="relative flex items-center gap-12 md:gap-24 overflow-x-auto px-4 no-scrollbar">
                {years.map((year) => {
                    const isSelected = selectedYear === year;
                    const isCurrent = year === currentYear;

                    return (
                        <button
                            key={year}
                            onClick={() => onYearChange(year)}
                            className={`relative group focus:outline-none transition-all duration-500 flex-shrink-0 ${isSelected ? 'text-white scale-110' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <span className={`text-2xl md:text-4xl font-light tracking-tight font-inter`}>
                                {year}
                            </span>
                            
                            {/* Selected Indicator */}
                            {isSelected && (
                                <div 
                                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                />
                            )}

                            {/* Current Year Label */}
                            {isCurrent && !isSelected && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-blue-500/50">
                                    Current
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default EventTimeline;
