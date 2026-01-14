
/* Cloudflare Worker for Maintenance Page - Premium Cyberpunk Theme */
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Maintenance | Astra IETM</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #030409;
            --neon-blue: #00f3ff;
            --neon-pink: #bc13fe;
            --neon-green: #0aff00;
            --text-muted: #6272a4;
            --glass-border: rgba(0, 243, 255, 0.2);
            --glass-bg: rgba(10, 15, 30, 0.7);
        }

        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-color);
            background-image: 
                linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            font-family: 'Rajdhani', sans-serif;
            color: white;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Ambient Glow */
        .glow-spot {
            position: absolute;
            width: 60vw;
            height: 60vw;
            background: radial-gradient(circle, rgba(0, 243, 255, 0.05) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 0;
        }

        .container {
            position: relative;
            z-index: 10;
            width: 90%;
            max-width: 600px;
            padding: 2.5rem;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 243, 255, 0.05);
            clip-path: polygon(
                0 0, 
                100% 0, 
                100% calc(100% - 20px), 
                calc(100% - 20px) 100%, 
                0 100%
            );
        }

        /* Decorative Corners */
        .corner {
            position: absolute;
            width: 10px;
            height: 10px;
            border: 2px solid var(--neon-blue);
            transition: all 0.3s ease;
        }
        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        h1 {
            font-size: 3rem;
            margin: 0;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-shadow: 0 0 10px var(--neon-blue);
            position: relative;
            display: inline-block;
        }
        
        /* Glitch Effect */
        h1::before, h1::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-color);
        }
        h1::before {
            left: 2px;
            text-shadow: -1px 0 #ff00c1;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        h1::after {
            left: -2px;
            text-shadow: -1px 0 #00fff9;
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim2 5s infinite linear alternate-reverse;
        }

        .subtitle {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Space Mono', monospace;
            color: var(--neon-pink);
            margin-bottom: 2rem;
            font-size: 0.9rem;
            letter-spacing: 1px;
        }

        .blink {
            width: 8px;
            height: 8px;
            background-color: var(--neon-pink);
            box-shadow: 0 0 10px var(--neon-pink);
            animation: blink 1s infinite steps(2);
        }

        p {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #dce7ff;
            margin-bottom: 2rem;
        }

        /* Bars */
        .loading-bar {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.1);
            position: relative;
            overflow: hidden;
            margin-bottom: 1.5rem;
        }
        .fill {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: var(--neon-blue);
            box-shadow: 0 0 15px var(--neon-blue);
            transform: translateX(-100%);
            animation: load 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Terminal Logs */
        .terminal {
            font-family: 'Space Mono', monospace;
            font-size: 0.8rem;
            color: var(--text-muted);
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 1rem;
            height: 60px;
            overflow: hidden;
            text-align: left;
        }
        .log-entry {
            display: block;
            margin-bottom: 4px;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }
        .log-entry span { color: var(--neon-green); margin-right: 8px; }

        @keyframes glitch-anim {
            0% { clip: rect(13px, 9999px, 81px, 0); }
            5% { clip: rect(74px, 9999px, 86px, 0); }
            10% { clip: rect(25px, 9999px, 20px, 0); }
            15% { clip: rect(6px, 9999px, 99px, 0); }
            20% { clip: rect(22px, 9999px, 60px, 0); }
            100% { clip: rect(69px, 9999px, 1px, 0); }
        }
        @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 100px, 0); }
            5% { clip: rect(2px, 9999px, 19px, 0); }
            10% { clip: rect(61px, 9999px, 34px, 0); }
            15% { clip: rect(29px, 9999px, 13px, 0); }
            20% { clip: rect(98px, 9999px, 5px, 0); }
            100% { clip: rect(10px, 9999px, 30px, 0); }
        }
        @keyframes blink { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes load { 0% { transform: translateX(-100%); } 50% { transform: translateX(0%); } 100% { transform: translateX(100%); } }
        @keyframes fadeIn { to { opacity: 1; } }

        /* Mobile Adjustments */
        @media (max-width: 600px) {
            h1 { font-size: 2.2rem; }
            .container { padding: 1.5rem; width: 95%; }
        }

        .copyright {
            position: absolute;
            bottom: 25px;
            width: 100%;
            text-align: center;
            font-family: 'Space Mono', monospace;
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.3);
            letter-spacing: 1px;
            z-index: 5;
        }
    </style>
</head>
<body>

    <div class="glow-spot"></div>

    <div class="container">
        <!-- Decorative Corners -->
        <div class="corner tl"></div>
        <div class="corner tr"></div>
        <div class="corner bl"></div>
        <div class="corner br"></div>

        <h1 data-text="SYSTEM OFFLINE">SYSTEM OFFLINE</h1>
        <div class="subtitle">
            <div class="blink"></div>
            <span>MAINTENANCE PROTOCOLS ACTIVE</span>
        </div>

        <p>The Astra IETM network is currently undergoing critical infrastructure upgrades. Secure connection will be re-established shortly.</p>

        <div class="loading-bar">
            <div class="fill"></div>
        </div>

        <div class="terminal" id="terminal">
            <div class="log-entry"><span>></span> Initializing secure shell...</div>
        </div>
    </div>

    <script>
        const logs = [
            "Encrypting data streams...",
            "Verifying integrity hashes...",
            "Optimizing neural core...",
            "Syncing database clusters...",
            "Flushing cache buffers...",
            "Rebooting security nodes..."
        ];
        
        const terminal = document.getElementById('terminal');
        let logIndex = 0;

        setInterval(() => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = '<span>></span> ' + logs[logIndex];
            
            // Keep only last 3 logs
            if (terminal.children.length > 2) {
                terminal.removeChild(terminal.firstChild);
            }
            
            terminal.appendChild(entry);
            logIndex = (logIndex + 1) % logs.length;
        }, 1500);
    </script>
    <div class="copyright">
        &copy; 2026 Astra IETM. All Rights Reserved.
    </div>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
