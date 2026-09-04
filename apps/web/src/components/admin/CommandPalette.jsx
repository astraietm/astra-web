import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    LayoutDashboard,
    Calendar, 
    Users, 
    QrCode, 
    Bell, 
    Image as ImageIcon, 
    FileText, 
    Settings, 
    Plus,
    Download,
    Send,
    Upload,
    ArrowRight
} from 'lucide-react';

const CommandPalette = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const commandGroups = [
        { 
            group: "Quick Actions",
            items: [
                { icon: Plus, label: "Create New Event", path: "/admin/events", action: "create", shortcut: "C" },
                { icon: Send, label: "Broadcast Announcement", path: "/admin/notifications", shortcut: "N" },
                { icon: Upload, label: "Upload Gallery Media", path: "/admin/gallery", shortcut: "U" },
                { icon: Download, label: "Export Registrations CSV", path: "/admin/registrations", shortcut: "X" },
            ] 
        },
        {
            group: "Navigation",
            items: [
                { icon: LayoutDashboard, label: "Dashboard Overview", path: "/admin", shortcut: "D" },
                { icon: Calendar, label: "Events Management", path: "/admin/events", shortcut: "E" },
                { icon: Users, label: "Attendee Registrations", path: "/admin/registrations", shortcut: "R" },
                { icon: QrCode, label: "Entrance Ticket Scanner", path: "/admin/scanner", shortcut: "S" },
                { icon: Bell, label: "Communications & Announcements", path: "/admin/notifications", shortcut: "A" },
                { icon: ImageIcon, label: "Media Library", path: "/admin/gallery", shortcut: "M" },
                { icon: FileText, label: "Activity & Audit Logs", path: "/admin/logs", shortcut: "L" },
                { icon: Settings, label: "Platform Settings", path: "/admin/settings", shortcut: "P" },
            ]
        }
    ];

    // Filter items based on search
    const filteredGroups = commandGroups.map(group => ({
        ...group,
        items: group.items.filter(item => 
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            group.group.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(group => group.items.length > 0);

    const flatFiltered = filteredGroups.flatMap(g => g.items);

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 40);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (flatFiltered.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + flatFiltered.length) % (flatFiltered.length || 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (flatFiltered[selectedIndex]) {
                    handleSelect(flatFiltered[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, flatFiltered]);

    const handleSelect = (item) => {
        if (item.path) {
            navigate(item.path);
        }
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                    />

                    {/* Palette Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.97, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="w-full max-w-xl bg-[#111319] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[60vh]"
                    >
                        {/* Search Bar */}
                        <div className="flex items-center px-4 py-3 border-b border-white/[0.08] gap-3 bg-white/[0.01]">
                            <Search className="w-4 h-4 text-slate-400 shrink-0" />
                            <input 
                                ref={inputRef}
                                type="text" 
                                placeholder="Type a command, page name, or action..." 
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-xs font-medium h-7"
                            />
                            <kbd className="px-2 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded text-[10px] font-mono text-slate-400">
                                ESC
                            </kbd>
                        </div>

                        {/* Results List */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2.5 custom-scrollbar" ref={listRef}>
                            {filteredGroups.length === 0 ? (
                                <div className="py-8 text-center text-slate-500 text-xs font-medium">
                                    No commands match "{search}"
                                </div>
                            ) : (
                                filteredGroups.map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-0.5">
                                        <h3 className="px-3 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                            {group.group}
                                        </h3>
                                        <div className="space-y-0.5">
                                            {group.items.map((item) => {
                                                const globalIndex = flatFiltered.findIndex(f => f === item);
                                                const isSelected = globalIndex === selectedIndex;
                                                const IconComponent = item.icon;

                                                return (
                                                    <button
                                                        key={item.label}
                                                        onClick={() => handleSelect(item)}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                                                            isSelected 
                                                                ? 'bg-blue-600 text-white' 
                                                                : 'text-slate-300 hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                                                            <span className="font-medium truncate">{item.label}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {item.shortcut && (
                                                                <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                                                    isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
                                                                }`}>
                                                                    {item.shortcut}
                                                                </kbd>
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Hints */}
                        <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[11px] text-slate-500">
                            <span>Use <kbd className="text-slate-400">↑</kbd> <kbd className="text-slate-400">↓</kbd> to navigate</span>
                            <span>Press <kbd className="text-slate-400">↵</kbd> to select</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CommandPalette;
