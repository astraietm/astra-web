/**
 * @typedef {Object} RegistrationField
 * @property {string} name - The unique field name (e.g., 'fullName', 'email')
 * @property {string} label - The visible label for the input
 * @property {'text' | 'email' | 'tel' | 'number' | 'select'} type - The input type
 * @property {boolean} required - Whether the field is mandatory
 * @property {string[]} [options] - Options for 'select' type fields
 * @property {string} [placeholder] - Placeholder text
 */

/**
 * @typedef {Object} Event
 * @property {number} id - Unique identifier
 * @property {string} title - Event title
 * @property {string} date - Date string (e.g., "October 15, 2024")
 * @property {string} venue - Location
 * @property {string} description - Short description
 * @property {string} category - Tag (e.g., "Conference", "Workshop")
 * @property {string} image - URL to event image
 * @property {string} [registration_link] - External registration URL (optional)
 * @property {Object} [registration_config] - Internal registration configuration (optional)
 * @property {boolean} registration_config.isOpen - Is registration currently active?
 * @property {string} [registration_config.deadline] - Optional deadline string
 * @property {RegistrationField[]} registration_config.fields - Array of form fields
 */

/**
 * ASTRA EVENTS DATABASE
 * ------------------------------------------------
 * HOW TO MANAGE EVENTS:
 * 
 * 1. ADD A NEW EVENT:
 *    Copy the template below and add it to the array.
 *    Ensure the 'id' is unique.
 * 
 * 2. CLOSE REGISTRATION:
 *    Set `registration_config.isOpen` to `false`.
 *    OR remove `registration_config` entirely if no registration is needed.
 * 
 * 3. EXTERNAL REGISTRATION:
 *    Remove `registration_config` and add `registration_link: "https://..."`.
 * 
 * 4. CUSTOM FIELDS:
 *    Add objects to the `fields` array. Supported types: text, email, select.
 */

/** @type {Event[]} */
const eventsData = [
    {
        id: 1,
        title: "Hawkins Lab",
        description: "Think fast • Observe closely • Team up • Save Hawkins.",
        long_description: "“Enter the Upside Down and stop Vecna!” A Stranger Things–themed cyber mystery event where teams solve clues, analyze patterns, and complete computer-based tasks to progress through an immersive storyline. This event is task-based and story-driven, inspired by cybersecurity concepts such as data accuracy, signal analysis, social engineering, and authentication, presented in a safe, fun, and interactive simulation. No advanced technical knowledge required. All students can participate.",
        date: "2026-02-12T10:00:00",
        event_date: "2026-02-12",
        time: "10:00 AM",
        venue: "BCA Lab",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2070",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: false,
        fee: "Free",
        category: "Cyber Mystery",
        is_team_event: true,
        team_size_min: 2,
        team_size_max: 4,
        prize: "Merit Certificates",
        coordinators: [{ name: "Anamika", phone: "" }],
        max_participation: 24,
        content_blocks: [
            {
                title: "Event Format",
                list: [
                    "Team-based event (2–4 members per team)",
                    "5 levels – 5 PCs (to be completed in order)",
                    "Each level unlocks the next",
                    "Difficulty increases gradually",
                    "Fastest team to complete all levels wins"
                ]
            },
            {
                title: "Levels Breakdown",
                items: [
                    { title: "Level 1", content: "Gaming" },
                    { title: "Level 2", content: "Speed typing" },
                    { title: "Level 3", content: "Analysis & decoding" },
                    { title: "Level 4", content: "Digital stalking (tracing)" },
                    { title: "Level 5", content: "Brute force approach" }
                ]
            },
            {
                title: "Rules",
                list: [
                    "Teams must follow the assigned PC order",
                    "Skipping levels or sharing clues is strictly prohibited",
                    "Only the provided systems may be used",
                    "No team changes once the event starts"
                ]
            }
        ]
    },
    {
        id: 995,
        title: "Shadow Login",
        description: "Crack. Decode. Access.",
        long_description: "Shadow Login is a time-bound, individual cybersecurity challenge designed to test participants’ skills in cryptography, logical analysis, and real-world password attack techniques. Participants must progress through three increasingly complex levels to gain unauthorized access to a simulated secure login system.",
        date: "2026-02-11T11:00:00",
        event_date: "2026-02-11",
        time: "11:00 AM",
        venue: "CCF/BCA Lab",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        duration: "1 Hour 30 Mins",
        is_registration_open: true,
        is_paid: true,
        fee: "₹50",
        category: "CTF Challenge",
        is_team_event: false,
        prize: "1st: ₹1000, 2nd: ₹500",
        coordinators: [{ name: "Archana", phone: "" }],
        max_participation: 30,
        content_blocks: [
            {
                title: "Game Structure",
                items: [
                    { title: "Level 1 – Hash Hunt", content: "Participants are provided with a set of hashed passwords. Using appropriate techniques and tools, players must identify the correct plain text password. Successful completion unlocks the next level and provides access to users.txt." },
                    { title: "Level 2 – Cipher Break", content: "Participants receive a multi-layer encrypted ciphertext. The objective is to analyze and decrypt the ciphertext to retrieve the original plaintext password. On completion, players receive passwords.txt." },
                    { title: "Level 3 – Shadow Login", content: "Using users.txt and passwords.txt, participants must identify the correct username – password combination and successfully log in to unlock the secured page." }
                ]
            },
            {
                title: "Rules & Guidelines",
                list: [
                    "Individual participation only",
                    "Internet access is allowed",
                    "Fixed time limit for all levels",
                    "Sharing of answers or files is prohibited",
                    "Ethical hacking and fair play must be followed"
                ]
            },
            {
                title: "Winning Criteria",
                content: "The participant who successfully completes the third level and logs in first within the allotted time will be declared the winner of Shadow Login."
            }
        ]
    },
    {
        id: 996,
        title: "Cipher Decode",
        description: "Decode the Chat. Find the Secret.",
        long_description: "A laptop has been left unlocked with WhatsApp Web open. The messages on the screen are completely scrambled using a custom encryption standard. Your goal is to manually decrypt the conversation using a provided physical key, read the hidden messages, and extract the proof of a secret relationship before time runs out.",
        date: "2026-02-11T14:00:00",
        event_date: "2026-02-11",
        time: "02:00 PM",
        venue: "Systems Lab",
        image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour",
        is_registration_open: true,
        is_paid: true,
        fee: "₹50",
        prize: "1st: ₹1000, 2nd: ₹500",
        category: "Cryptanalysis Challenge",
        is_team_event: false,
        max_participation: 20,
        coordinators: [{ name: "Jenna", phone: "" }, { name: "Anjal", phone: "" }],
        content_blocks: [
            {
                title: "Technical Brief: The Cryptography",
                content: "This event challenges you to perform a manual Monoalphabetic Substitution Decryption. Unlike simple shift ciphers (like Caesar or Atbash) which follows a predictable pattern, this encryption uses a Randomized Key. A Random Substitution Cipher replaces each letter of the plaintext alphabet with a randomly assigned letter from the cipher alphabet."
            },
            {
                title: "How to Decrypt (No Internet Required)",
                list: [
                    "The Physical Key: You will be handed a unique 'Cipher Key Printout' at the start of the event. This document contains the mapping (e.g., A=Q, B=P, C=L).",
                    "Manual Decoding: You must cross-reference every letter in the chat bubbles against your printout to translate the gibberish back into English.",
                    "Speed & Accuracy: Since the key is random, you cannot guess the pattern. You must be fast and precise in your transcription."
                ]
            },
            {
                title: "Algorithm",
                content: "There is no mathematical formula to reverse it. The only way to decode the message is by possessing the specific Key that maps the substitution.\nPlaintext: A B C D E ...\nCiphertext: Q W E R T ... (Randomly assigned)"
            },
            {
                title: "Rules",
                list: [
                    "Offline Environment: No digital tools, online solvers, or frequency analysis software allowed.",
                    "Proof of Work: You must submit the decrypted Name, Time, and Location found in the chat.",
                    "Tools Provided: The Encrypted Terminal, Pen, Paper, and the Cipher Key Printout."
                ]
            }
        ]
    },
    {
        id: 997,
        title: "The Last Login",
        description: "Follow the digital trail. Find the truth.",
        long_description: "A senior employee of an IT company has been found dead under suspicious circumstances. His system was left behind with digital traces still intact. Recovered evidence includes: Emails, System logs, Images, Text notes. Your mission is to analyze the data, connect the clues, and identify the criminal before time runs out.",
        date: "2026-02-12T15:00:00",
        event_date: "2026-02-12",
        time: "03:00 PM",
        venue: "Systems Lab",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour 30 Mins",
        is_registration_open: true,
        is_paid: true,
        fee: "₹50",
        category: "Digital Forensics",
        is_team_event: true,
        team_size_min: 2,
        team_size_max: 3,
        max_participation: 45,
        prize: "Cash Prize: ₹500",
        coordinators: [{ name: "Laiqa", phone: "" }],
        content_blocks: [
            {
                title: "Objective",
                content: "Determine: Who committed the crime, How it was carried out, Why it happened, and Which evidence proves it."
            },
            {
                title: "Event Structure",
                items: [
                    { title: "Round 1 – Lock & Key", content: "Solve short logic and observation challenges. Each correct answer reveals one digit. Arrange all digits in order to unlock the final code. Only teams that crack the code qualify." },
                    { title: "Round 2 – Investigation", content: "Access the digital case files. Analyze evidence carefully. Not all files are important. Some clues may mislead you." },
                    { title: "Round 3 – Final Verdict", content: "Submit: Culprit’s name, Motive, Method, and Minimum two supporting clues." }
                ]
            },
            {
                title: "Team Details & Rules",
                list: [
                    "2–3 members per team",
                    "Individual participation is not allowed",
                    "Teams must work independently",
                    "This is not a hacking event",
                    "Internet usage is prohibited",
                    "Use only the provided files",
                    "Do not edit, delete, or rename files",
                    "No discussion with other teams",
                    "Judges’ decision is final"
                ]
            },
            {
                title: "Scoring",
                content: "Correct suspect (30) + Correct motive (20) + Correct method (20) + Valid evidence (20) + Time efficiency (10) = Total 100"
            },
            {
                title: "Investigator Note",
                content: "Small details matter. Think logically, not emotionally. Time is limited. TRUST THE DATA. The truth is hidden in the system."
            }
        ]
    },
    {
        id: 998,
        title: "Buried Secrets",
        description: "Follow the money, find the liar",
        long_description: "A social deduction game of strategy and deception where a hidden Mafia team conceals a treasure while civilians attempt to uncover both the truth and the treasure itself. The ultimate winner is the player who owns the treasure last at the end of the 4th round.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "Mech Lab",
        image: "https://images.unsplash.com/photo-1478720568477-152d0b3d0f0c?auto=format&fit=crop&q=80&w=2070",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "₹25",
        category: "Social Deduction",
        is_team_event: false,
        max_participation: 26,
        prize: "Cash Prize: ₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Game Structure",
                content: "Total players: 13. Roles: 3 Mafia, 1 Doctor, 1 Detective, 1 Broker, remaining players are Civilians. The game consists of 4 total rounds."
            },
            {
                title: "Role Descriptions",
                list: [
                    "Coordinator: Neutral moderator who manages time, blindfolds, and narration.",
                    "Mafia: Secret team that hides the treasure and eliminates one player each night.",
                    "Civilian: Hunts for the treasure and votes during the day phase.",
                    "Doctor: Can protect one player from being killed each night.",
                    "Detective: Investigates one player each night to learn if they are Mafia.",
                    "Broker: A neutral role who trades information to ensure survival."
                ]
            },
            {
                title: "Core Rules",
                list: [
                    "No peeking: Eyes must be closed or blindfolds on during night phases.",
                    "Dead men tell no tales: Eliminated players must remain silent.",
                    "No reveal: Role cards cannot be shown while alive."
                ]
            },
            {
                title: "Strategy",
                content: "This is not a game of honesty. Use only your wits and intuition. Think suspiciously, not emotionally. Trust no one. The truth is hidden behind the lies!"
            }
        ]
    },
    {
        id: 999,
        title: "Barroz: Treasure Hunt",
        description: "Unlock the mystery. Find the gold.",
        long_description: "Teams must solve clues in order to reach the final treasure. The first team to find the final treasure or solve the last clue wins.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "IETM Campus",
        image: "https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=2000",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10 per Head",
        category: "Treasure Hunt",
        is_team_event: true,
        team_size_min: 2,
        team_size_max: 4,
        max_participation: 40,
        prize: "TBD",
        coordinators: [],
        content_blocks: [
            {
                title: "Teams",
                list: [
                    "A maximum of 10 teams can participate",
                    "Each team can have “up to 4 members”",
                    "All team members must check in together at the start",
                    "Each team will be given one set of clues to follow"
                ]
            },
            {
                title: "How to Play",
                list: [
                    "Each team will receive the first clue at the start",
                    "Clues must be solved in order — skipping clues is not allowed",
                    "Teams must stay together; everyone should remain with their group throughout the hunt",
                    "Teams cannot use outside help (friends not in the hunt) to solve clues during the hunt"
                ]
            },
            {
                title: "Fair Play & Safety",
                list: [
                    "No running dangerously, pushing, or interfering with other teams’ progress",
                    "Respect property, participants, and allowed areas — do not enter restricted zones",
                    "Do not move or damage clue placements",
                    "Organizers’ decisions on rule interpretations are final"
                ]
            },
            {
                title: "Timing & Winning",
                content: "The treasure hunt has a total time limit of 2 hours. Teams must complete all clues and reach the final treasure within 2 hours to qualify for prizes. The first team to correctly solve all clues and reach the final treasure within the time limit wins. In case of a tie, organizers will apply tie-breaker rules (e.g., fastest time on key checkpoints)."
            }
        ]
    },
    {
        id: 1000,
        title: "8 Ball Pool",
        description: "Chalk up and break.",
        long_description: "An 8 Ball Pool Tournament conducted in a team format of two players each. The tournament will feature 8 teams competing in a knockout format. All teams will compete from the quarterfinal stage, ensuring a balanced and straightforward tournament structure. All matches will be played as Best of 1, except the Final, which will be conducted as a Best of 3 series.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "8 Ball Pool Court",
        image: "https://images.unsplash.com/photo-1588661803738-4e8913346d0d?auto=format&fit=crop&q=80&w=2066",
        duration: "nil",
        is_registration_open: true,
        is_paid: true,
        fee: "₹25",
        category: "Sports",
        is_team_event: true,
        team_size_min: 2,
        team_size_max: 2,
        max_participation: 16,
        prize: "Cash Prize: ₹200",
        coordinators: [{ name: "Aakif", phone: "" }],
        content_blocks: [
            {
                title: "Rules & Regulations",
                list: [
                    "Each team shall consist of two players",
                    "The tournament will follow a knockout format with 8 teams",
                    "All teams will begin play from the quarterfinal round",
                    "All matches will be Best of 1, except the Final, which will be Best of 3",
                    "Teams must play in strict alternate-shot order",
                    "The break will be decided by a coin toss",
                    "All fouls will result in ball-in-hand anywhere on the table",
                    "The 8-ball must be called before attempting the final shot",
                    "A scratch on the 8-ball will result in an immediate loss of the frame",
                    "The referee’s decision will be final"
                ]
            }
        ]
    },
    {
        id: 1001,
        title: "E-Football League",
        description: "Settle it on the pitch.",
        long_description: "32 slots. Knockout Format Tournament. 4 groups with 8 players in each. Every GAME is knockout.",
        date: "2026-02-11T14:00:00",
        event_date: "2026-02-11",
        time: "02:00 PM",
        venue: "Lecture Hall",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
        duration: "nil",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "eSports",
        is_team_event: false,
        max_participation: 32,
        prize: "Cash Prize: ₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Match Settings",
                list: [
                    "Match Time: 8 Mins",
                    "Team Strength: Unlimited",
                    "Player Form: Random",
                    "Subs: 6",
                    "Extra Time: On",
                    "Penalties: On"
                ]
            },
            {
                title: "Rules",
                list: [
                    "If a disconnection occurs, the match should be resumed for the remaining time only",
                    "No double attacking and defending mode",
                    "Follow the instructions given by the Admins",
                    "Any Violation of rule result in disqualify",
                    "The Admins' decision will be final"
                ]
            }
        ]
    },
    {
        id: 1003,
        title: "Mini Militia",
        description: "Doodle Army 2: Mobile War.",
        long_description: "The Mini Militia Tournament is an exciting competitive gaming event designed to test players’ skills, strategy, and reflexes. Based on the popular multiplayer action game Mini Militia – classic, the tournament brings together players to battle in intense combat matches using a variety of weapons, tactics, and maps.",
        date: "2026-02-11T13:30:00",
        event_date: "2026-02-11",
        time: "01:30 PM",
        venue: "Lecture Hall",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "eSports",
        is_team_event: true,
        team_size_min: 2,
        team_size_max: 2,
        max_participation: 40,
        prize: "Cash Prize: ₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Game Settings",
                list: [
                    "Game Mode: Deathmatch",
                    "Map: Selected by organizers",
                    "Time Limit: Fixed for all matches",
                    "Private Room: Only tournament players are allowed"
                ]
            },
            {
                title: "Fair Play Rules",
                list: [
                    "Use of mods, hacks, cheats, or third-party tools is strictly prohibited",
                    "Exploiting glitches or bugs is not allowed",
                    "Any form of unfair behavior will result in immediate disqualification",
                    "Once a match starts, restarting or leaving the game is not permitted"
                ]
            },
            {
                title: "Elimination & Winners",
                list: [
                    "Matches will be knockout-based",
                    "Winners will be decided based on final scores or match victories"
                ]
            }
        ]
    },
    {
        id: 1004,
        title: "Paper Toss",
        description: "Precision and aim. Simple yet challenging.",
        long_description: "A classic test of focus and motor skills. Can you land the crumpled paper in the bin from varying distances? Compete against others in this high-tension, low-tech challenge of accuracy.",
        date: "2026-02-26T15:00:00",
        event_date: "2026-02-26",
        time: "03:00 PM",
        venue: "Front Porch",
        image: "https://images.unsplash.com/photo-1590402485294-219600ad9550?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "Fun",
        is_team_event: false,
        max_participation: 50,
        prize: "1st: ₹100",
        coordinators: [],
        content_blocks: [
            {
                title: "Rules",
                list: [
                    "Individual participation",
                    "Three attempts per distance level",
                    "The distance increases after each successful toss",
                    "In case of a tie, a speed round will be held"
                ]
            }
        ]
    }
];

export default eventsData;
