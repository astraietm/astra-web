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
        description: "Think fast • Observe closely • Team up • Save Hawkins. A Stranger Things–themed cyber mystery event.",
        long_description: "A Stranger Things–themed cyber mystery event. Team-based (2–4 members). 5 levels, 5 PCs. Fastest team wins.",
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
        prize: "Merit Certificates",
        coordinators: [{ name: "Anamika", phone: "" }],
        max_participation: 24,
        content_blocks: [
            {
                title: "Event Format",
                content: "Team-based (2–4 members). 5 levels, 5 PCs. Fastest team wins."
            },
            {
                title: "Levels",
                items: [
                    { title: "Level 1", content: "Gaming" },
                    { title: "Level 2", content: "Speed typing" },
                    { title: "Level 3", content: "Analysis & decoding" },
                    { title: "Level 4", content: "Digital tracing" },
                    { title: "Level 5", content: "Brute force approach" }
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
                    { title: "Level 3 – Shadow Login", content: "Using users.txt and passwords.txt, participants must identify the correct username–password combination and successfully log in to unlock the secured page." }
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
                content: "The participant who successfully completes the third level and logs in first within the allotted time will be declared the winner."
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
                title: "Technical Brief",
                content: "This event challenges you to perform a manual Monoalphabetic Substitution Decryption. Unlike simple shift ciphers (like Caesar or Atbash), this encryption uses a randomized key."
            },
            {
                title: "How to Decrypt",
                list: [
                    "You will receive a unique Cipher Key Printout (example: A=Q, B=P, C=L).",
                    "Manually cross-reference every letter in the chat against the key.",
                    "Speed and accuracy are crucial."
                ]
            },
            {
                title: "Rules",
                list: [
                    "Offline environment only",
                    "No digital tools or solvers allowed",
                    "Submit decrypted Name, Time, and Location",
                    "Tools provided: Encrypted terminal, pen, paper, cipher key printout"
                ]
            }
        ]
    },
    {
        id: 997,
        title: "The Last Login",
        description: "Follow the digital trail. Find the truth.",
        long_description: "A senior employee of an IT company has been found dead under suspicious circumstances. His system was left behind with digital traces intact. Recovered evidence includes Emails, System logs, Images, and Text notes.",
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
                    { title: "Round 1 – Lock & Key", content: "Solve logic challenges to reveal digits and unlock the final code." },
                    { title: "Round 2 – Investigation", content: "Analyze digital case files. Some clues may mislead you." },
                    { title: "Round 3 – Final Verdict", content: "Submit culprit’s name, motive, method, and minimum two supporting clues." }
                ]
            },
            {
                title: "Team Details & Rules",
                list: [
                    "2–3 members per team. No individual participation.",
                    "This is not a hacking event.",
                    "Internet usage prohibited.",
                    "Use only provided files.",
                    "Judges’ decision is final."
                ]
            },
            {
                title: "Scoring",
                content: "Correct suspect (30) + Correct motive (20) + Correct method (20) + Valid evidence (20) + Time efficiency (10) = Total 100"
            }
        ]
    },
    {
        id: 998,
        title: "Buried Secrets",
        description: "Follow the money, find the liar",
        long_description: "A social deduction game of strategy and deception involving Mafia, civilians, and hidden treasure. Total Players: 13. Roles: Mafia (3), Doctor, Detective, Broker, Civilians.",
        date: "2026-02-12T15:00:00",
        event_date: "2026-02-12",
        time: "03:00 PM",
        venue: "Mech Lab",
        image: "https://images.unsplash.com/photo-1541560052-5e3028e05d03?auto=format&fit=crop&q=80&w=2070",
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
                title: "Core Rules",
                list: [
                    "No peeking during night phase",
                    "Eliminated players must remain silent",
                    "No role reveals",
                    "Trust no one"
                ]
            }
        ]
    },
    {
        id: 999,
        title: "Barroz: Treasure Hunt",
        description: "Unlock the mystery. Find the gold.",
        long_description: "Teams must solve clues in order to reach the final treasure.",
        date: "2026-02-12T15:00:00",
        event_date: "2026-02-12",
        time: "03:00 PM",
        venue: "IETM Campus",
        image: "https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=2000",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10 per Head",
        category: "Treasure Hunt",
        is_team_event: true,
        max_participation: 40,
        prize: "TBD",
        coordinators: [],
        content_blocks: [
            {
                title: "Teams",
                list: [
                    "Maximum 10 teams",
                    "Up to 4 members per team",
                    "Teams receive one set of clues"
                ]
            },
            {
                title: "Fair Play",
                list: [
                    "No running or interference",
                    "Respect property and boundaries",
                    "Organizers’ decisions are final"
                ]
            }
        ]
    },
    {
        id: 1000,
        title: "8 Ball Pool",
        description: "Chalk up and break.",
        long_description: "Team of 2 players. Knockout format (8 teams). Final is Best of 3. Alternate shots mandatory.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "Recreation Room",
        image: "https://images.unsplash.com/photo-1588661803738-4e8913346d0d?auto=format&fit=crop&q=80&w=2066",
        duration: "nil",
        is_registration_open: true,
        is_paid: true,
        fee: "₹25",
        category: "Sports",
        is_team_event: true,
        max_participation: 16,
        prize: "Cash Prize: ₹200",
        coordinators: [{ name: "Aakif", phone: "" }],
        content_blocks: [
            {
                title: "Format",
                list: [
                    "Team of 2 players",
                    "Knockout format (8 teams)",
                    "Final is Best of 3",
                    "Alternate shots mandatory"
                ]
            }
        ]
    },
    {
        id: 1001,
        title: "E-Football League",
        description: "Settle it on the pitch.",
        long_description: "32 slots. Knockout tournament. Match time: 8 minutes. Admin’s decision is final.",
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
                title: "Details",
                list: [
                    "32 slots",
                    "Knockout tournament",
                    "Match time: 8 minutes",
                    "Admin’s decision is final"
                ]
            }
        ]
    },
    {
        id: 1003,
        title: "Mini Militia",
        description: "Doodle Army 2: Mini Militia mobile war.",
        long_description: "Duo format. Deathmatch mode. No hacks or mods. Knockout-based matches.",
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
        max_participation: 40,
        prize: "Cash Prize: ₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Rules",
                list: [
                    "Duo format",
                    "Deathmatch mode",
                    "No hacks or mods",
                    "Knockout-based matches"
                ]
            }
        ]
    }
];

export default eventsData;
