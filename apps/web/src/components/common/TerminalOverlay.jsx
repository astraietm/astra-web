import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon, Maximize2, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TerminalOverlay = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'info', content: 'ASTRA_OS v2.4.0 [SECURE CONNECTION]' },
        { type: 'info', content: 'Copyright (c) 2026 Astra . All rights reserved.' },
        { type: 'success', content: 'Type "help" to see available commands.' }
    ]);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Keep focus
    useEffect(() => {
        const handleClick = () => inputRef.current?.focus();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const newHistory = [...history, { type: 'input', content: `root@astra:~# ${cmd}` }];

        switch (cleanCmd) {
            case 'help':
                newHistory.push({ type: 'info', content: 'Available commands:' });
                newHistory.push({ type: 'info', content: '  about     - Navigate to About page' });
                newHistory.push({ type: 'info', content: '  events    - View upcoming operations' });
                newHistory.push({ type: 'info', content: '  gallery   - View visual intelligence' });
                newHistory.push({ type: 'info', content: '  clear     - Clear terminal buffer' });
                newHistory.push({ type: 'info', content: '  exit      - Close terminal session' });
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'about':
                newHistory.push({ type: 'success', content: 'Initiating transfer to ABOUT sector...' });
                setTimeout(() => { navigate('/about'); onClose(); }, 1000);
                break;
            case 'events':
                newHistory.push({ type: 'success', content: 'Retrieving EVENT_LOGS...' });
                setTimeout(() => { navigate('/events'); onClose(); }, 1000);
                break;
            case 'gallery':
                newHistory.push({ type: 'success', content: 'Accessing VISUAL_DB...' });
                setTimeout(() => { navigate('/gallery'); onClose(); }, 1000);
                break;
            case 'exit':
                onClose();
                return;
            case '':
                break;
            default:
                newHistory.push({ type: 'error', content: `Command not found: ${cleanCmd}` });
        }

        setHistory(newHistory);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <div className="w-full max-w-3xl bg-[#0c0c0c] border border-gray-800 rounded-lg shadow-2xl overflow-hidden flex flex-col h-[60vh] md:h-[500px] font-mono text-sm relative">
                {/* Title Bar */}
                <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800 select-none">
                    <div className="flex items-center gap-2 text-gray-400">
                        <TerminalIcon className="w-4 h-4" />
                        <span className="text-xs font-bold">ASTRA_TERMINAL_EMULATOR</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-white/10 rounded" onClick={onClose}><Minus className="w-3 h-3 text-gray-400" /></button>
                        <button className="p-1 hover:bg-white/10 rounded"><Maximize2 className="w-3 h-3 text-gray-400" /></button>
                        <button className="p-1 hover:bg-red-500/20 text-red-400 rounded" onClick={onClose}><X className="w-3 h-3" /></button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar" onClick={() => inputRef.current?.focus()}>
                    {history.map((line, i) => (
                        <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-500' :
                                line.type === 'success' ? 'text-green-500' :
                                    line.type === 'warning' ? 'text-yellow-500' :
                                        line.type === 'input' ? 'text-gray-300' :
                                            'text-gray-400'
                            }`}>
                            {line.content}
                        </div>
                    ))}

                    <div className="flex items-center gap-2 text-primary mt-2">
                        <span className="text-green-500">root@astra:~#</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none flex-1 text-gray-100 placeholder-gray-600"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>

                {/* CRT Scanline Effect Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
            </div>
        </motion.div>
    );
};

export default TerminalOverlay;
