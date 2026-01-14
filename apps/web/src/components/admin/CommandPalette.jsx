import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Calendar, 
    Mail, 
    Image, 
    ShieldCheck, 
    Users, 
    Settings,
    LogOut,
    Terminal,
    Command
} from 'lucide-react';

const CommandPalette = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const actions = [
        { 
            group: "Quick Actions",
            items: [
                { icon: Calendar, label: "Create New Event", path: "/admin/events/new", shortcut: "C" },
                { icon: Mail, label: "Send Email Blast", path: "/admin/notifications", shortcut: "E" },
                { icon: Image, label: "Manage Gallery", path: "/admin/gallery", shortcut: "G" },
            ] 
        },
        {
            group: "Navigation",
            items: [
                { icon: Users, label: "Search Registrations", path: "/admin/registrations", shortcut: "R" },
                { icon: ShieldCheck, label: "System Logs", path: "/admin/logs", shortcut: "L" },
                { icon: Settings, label: "Settings", path: "/admin/settings", shortcut: "S" },
                { icon: Terminal, label: "Scanner Console", path: "/admin/scanner" },
            ]
        }
    ];

    // Flatten items for keyboard navigation filtering
    const allItems = actions.flatMap(g => g.items);
    const filteredItems = actions.map(group => ({
        ...group,
        items: group.items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    })).filter(group => group.items.length > 0);

    const flatFiltered = filteredItems.flatMap(g => g.items);

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % flatFiltered.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + flatFiltered.length) % flatFiltered.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = flatFiltered[selectedIndex];
                if (item) {
                    handleSelect(item);
                }
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, flatFiltered]);

    const handleSelect = (item) => {
        navigate(item.path);
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Palette */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[60vh]"
                    >
                        {/* Search Bar */}
                        <div className="flex items-center px-4 py-3 border-b border-white/5 gap-3">
                            <Search className="w-5 h-5 text-gray-500" />
                            <input 
                                ref={inputRef}
                                type="text" 
                                placeholder="Type a command or search..." 
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-sm font-medium font-inter h-6"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">ESC</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex-1 overflow-y-auto p-2" ref={listRef}>
                            {filteredItems.length === 0 ? (
                                <div className="py-12 text-center text-gray-500 text-sm">
                                    No results found.
                                </div>
                            ) : (
                                filteredItems.map((group, gIdx) => (
                                    <div key={gIdx} className="mb-2 last:mb-0">
                                        <h3 className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                            {group.group}
                                        </h3>
                                        <div>
                                            {group.items.map((item, i) => {
                                                const globalIndex = flatFiltered.findIndex(f => f === item);
                                                const isSelected = globalIndex === selectedIndex;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`
                                                            w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors
                                                            ${isSelected ? 'bg-vision-primary/10 text-white' : 'text-gray-400 hover:text-white'}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={`w-4 h-4 ${isSelected ? 'text-vision-primary' : 'text-gray-500'}`} />
                                                            <span className="text-sm font-medium">{item.label}</span>
                                                        </div>
                                                        {item.shortcut && (
                                                            <span className="text-[10px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-gray-500 font-mono hidden md:block">
                                                                {item.shortcut}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                         {/* Footer hints */}
                         <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-[10px] text-gray-500">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1"><Command size={10} /> <span>Open</span></span>
                                <span className="flex items-center gap-1"><ArrowDownRight size={10} /> <span>Select</span></span>
                            </div>
                             <div>ASTRA Intelligent Command</div>
                         </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CommandPalette;
