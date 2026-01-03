import React, { useEffect, useState, useRef } from 'react';

const TerminalBackground = () => {
    const [logs, setLogs] = useState([]);
    const scrollRef = useRef(null);

    const commands = [
        { text: "check_root()... OK", type: "success" },
        { text: "init_protocol_v2... STARTED", type: "info" },
        { text: "bypassing_firewall_daemon... SUCCESS", type: "success" },
        { text: "injecting_payload... WAITING", type: "warning" },
        { text: "connecting_to_server (192.168.0.x)... ESTABLISHED", type: "success" },
        { text: "decrypting_packets... 14% COMPLETE", type: "info" },
        { text: "decrypting_packets... 48% COMPLETE", type: "info" },
        { text: "decrypting_packets... 99% COMPLETE", type: "info" },
        { text: "access_granted.root@astra", type: "success" },
        { text: "starting_daemons...", type: "info" },
        { text: "mount /dev/sda1... OK", type: "success" },
        { text: "CRITICAL: Security Breach Incident #9299", type: "error" },
        { text: "rolling_back_snapshot... DONE", type: "warning" },
        { text: "scanning_ports... 21, 80, 443 OPEN", type: "warning" },
        { text: "traceroute 10.0.0.1... HIDDEN", type: "info" },
        { text: "fetching_assets...", type: "info" },
        { text: "compiling_kernel_modules...", type: "info" },
        { text: "brute_force_attack.exe... FAILED", type: "error" },
        { text: "system_ready", type: "success" }
    ];

    // Helper to generate random hex string
    const getHex = (len) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

    // Pre-fill logs to avoid empty screen on load
    useEffect(() => {
        const initialLogs = [];
        for (let i = 0; i < 40; i++) {
             const randomCmd = commands[Math.floor(Math.random() * commands.length)];
             const timestamp = new Date(Date.now() - (40 - i) * 1000).toISOString().split('T')[1].split('.')[0];
             const extraData = `[MEM:0x${getHex(8)}] [PID:${Math.floor(Math.random() * 9999)}] [HASH:${getHex(12)}] [THREAD:0x${getHex(4)}] [FLAGS:0x${getHex(4)}] [SIG:${getHex(16)}] [OFFSET:0x${getHex(8)}]`;
             
             initialLogs.push({ ...randomCmd, text: `${randomCmd.text.padEnd(45, '\u00A0')} ${extraData}`, timestamp });
        }
        setLogs(initialLogs);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomCmd = commands[Math.floor(Math.random() * commands.length)];
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            const extraData = `[MEM:0x${getHex(8)}] [PID:${Math.floor(Math.random() * 9999)}] [HASH:${getHex(12)}] [THREAD:0x${getHex(4)}] [FLAGS:0x${getHex(4)}] [SIG:${getHex(16)}] [OFFSET:0x${getHex(8)}]`;
            
            // Use non-breaking space for padding
            setLogs(prev => [...prev.slice(-50), { ...randomCmd, text: `${randomCmd.text.padEnd(45, '\u00A0')} ${extraData}`, timestamp }]); 

            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100); // Faster scrolling for "Matrix" feel

        return () => clearInterval(interval);
    }, []);

    const getColor = (type) => {
        switch (type) {
            case 'success': return 'text-primary';
            case 'error': return 'text-red-500';
            case 'warning': return 'text-yellow-500';
            default: return 'text-blue-300'; // Brighter text
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.05] overflow-hidden bg-black/60">
             <div 
                ref={scrollRef}
                className="p-8 font-mono text-sm md:text-base w-full h-full flex flex-col justify-end overflow-hidden mask-image-gradient"
                style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%)' }}
            >
                {logs.map((log, i) => (
                    <div key={i} className={`whitespace-nowrap font-bold tracking-wide ${getColor(log.type)} opacity-80 hover:opacity-100 transition-opacity`}>
                        <span className="text-gray-600 mr-4 opacity-50">[{log.timestamp}]</span>
                        <span className="text-gray-500 mr-3 opacity-50">$</span>
                        {log.text}
                    </div>
                ))}
            </div>
            
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10"></div>
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-20"></div>
        </div>
    );
};

export default TerminalBackground;
