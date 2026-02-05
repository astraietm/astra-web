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
        description: "Lost Login: A Stranger Things–themed cyber mystery event where teams solve clues, analyze patterns, and complete tasks to progress through an immersive storyline.",
        long_description: "A Stranger Things–themed cyber mystery event where teams solve clues, analyze patterns, and complete tasks to progress through an immersive storyline. Fastest team to successfully navigate all 5 levels wins.",
        date: "2026-02-12T10:00:00",
        event_date: "2026-02-12",
        time: "10:00 AM",
        venue: "BCA lab",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2070",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: false,
        fee: "₹0",
        category: "Cyber Mystery",
        is_team_event: true,
        prize: "Merit Certificates",
        coordinators: [{ name: "Anamika", phone: "" }],
        max_participation: 24,
        content_blocks: [
            {
                title: "Mission Briefing",
                content: "LOST LOGIN - ENTER THE UPSIDE DOWN! This event is task-based and story-driven, inspired by cybersecurity concepts such as data accuracy, signal analysis, social engineering, and authentication."
            },
            {
                title: "Levels Breakdown",
                items: [
                    { title: "Level 1 – Gaming", content: "Initial contact. Test your focus and reflexes in the digital void." },
                    { title: "Level 2 – Speed Typing", content: "Critical data entry. Extract credentials under high-pressure constraints." },
                    { title: "Level 3 – Analysis & Decoding", content: "Cognitive override. Analyze signals and solve cryptic patterns." },
                    { title: "Level 4 – Digital Stalking", content: "Network tracing. Track an anomaly's footprint across the Hawkins infrastructure." },
                    { title: "Level 5 – Brute Force", content: "The final approach. Execute a system override to seal the gate." }
                ]
            }
        ]
    },
    {
        id: 995,
        title: "Shadow Login",
        description: "Crack. Decode. Access. Shadow Login is a time-bound individual cybersecurity challenge designed to test your skills in cryptography, logical analysis, and real-world password attack techniques.",
        long_description: "Shadow Login is a time-bound individual cybersecurity challenge designed to test your skills in cryptography, logical analysis, and real-world password attack techniques. Participants must progress through three increasingly complex levels to gain unauthorized access to a simulated secure login system.",
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
        prize: "₹500",
        coordinators: [{ name: "Archana", phone: "" }],
        max_participation: 30,
        content_blocks: [
            {
                title: "Game Structure",
                items: [
                    { title: "Level 1 – Hash Hunt", content: "Participants are provided with a set of hashed passwords. Using appropriate tools and techniques, players must identify the correct plaintext password. Successful completion unlocks the next level and provides access to users.txt." },
                    { title: "Level 2 – Cipher Break", content: "Participants receive a multi-layer encrypted ciphertext. The objective is to analyze and decrypt the ciphertext to retrieve the original plaintext password. On completion, players receive passwords.txt." },
                    { title: "Level 3 – Shadow Login", content: "Using users.txt and passwords.txt, participants must identify the correct username–password combination and successfully log in to unlock the secured page." }
                ]
            }
        ]
    },
    {
        id: 996,
        title: "Cipher Decode",
        description: "Decode the Chat. Find the Secret. A hands-on cryptography challenge where participants must manually decrypt an encrypted WhatsApp-style conversation using a physical cipher key.",
        long_description: "Cipher Decode is a hands-on cryptography challenge where participants must manually decrypt an encrypted WhatsApp-style conversation using a physical cipher key. Accuracy, speed, and logical reasoning are crucial—there are no shortcuts.",
        date: "2026-02-11T14:00:00",
        event_date: "2026-02-11",
        time: "02:00 PM",
        venue: "Systems Lab",
        image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour",
        is_registration_open: true,
        is_paid: true,
        fee: "₹50",
        prize: "₹500",
        category: "Cryptanalysis Challenge",
        is_team_event: true,
        max_participation: 20,
        coordinators: [{ name: "Jenna", phone: "" }, { name: "Anjal", phone: "" }],
        content_blocks: [
            {
                title: "The Mission",
                content: "A laptop has been left unlocked with WhatsApp Web open. The messages on the screen are completely scrambled using a custom encryption standard. Your objective is to manually decrypt the conversation, reveal the hidden messages, and extract proof of a secret relationship before time runs out."
            }
        ]
    },
    {
        id: 997,
        title: "The Last Login",
        description: "Follow the digital trail. Find the truth. A digital forensics murder mystery challenge.",
        long_description: "A senior employee of an IT company has been found dead under suspicious circumstances. His system was left behind with digital traces still intact. Recovered evidence includes emails, system logs, images, and text notes. Your mission is to analyze the data, connect the clues, and identify the criminal before time runs out.",
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
        prize: "₹500",
        coordinators: [{ name: "Laiqa", phone: "" }],
        content_blocks: [
            {
                title: "Event Structure",
                items: [
                    { title: "Round 1 – Lock & Key", content: "Solve short logic and observation challenges. Each correct answer reveals one digit. Arrange all digits in order to unlock the final code. Only teams that crack the code qualify." },
                    { title: "Round 2 – Investigation", content: "Access the digital case files. Analyze evidence carefully. Not all files are important. Some clues may mislead you." },
                    { title: "Round 3 – Final Verdict", content: "Submit: Culprit’s name, Motive, Method, Minimum two supporting clues." }
                ]
            }
        ]
    },
    {
        id: 998,
        title: "Buried Secrets",
        description: "Follow the money, find the liar. A social deduction game of strategy and deception.",
        long_description: "A social deduction game of strategy and deception where a hidden Mafia team conceals a treasure while civilians attempt to uncover both the truth and the treasure itself. The ultimate winner is the player who owns the treasure last at the end of the 4th round.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "Mech lab",
        image: "https://images.unsplash.com/photo-1541560052-5e3028e05d03?auto=format&fit=crop&q=80&w=2070",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "₹25",
        category: "Social Deduction",
        is_team_event: false,
        max_participation: 26,
        prize: "₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Game Structure",
                content: "Total players: 13 per set. Roles: 3 Mafia, 1 Doctor, 1 Detective, 1 Broker, remaining players are Civilians. The game consists of 4 total rounds."
            }
        ]
    },
    {
        id: 999,
        title: "Barroz: Treasure Hunt",
        description: "Unlock the mystery. Find the gold. A campus-wide treasure hunt.",
        long_description: "Teams must solve each clue in the correct order to reach the next location or puzzle. The first team to find the final treasure or solve the last clue wins. A test of wits, speed, and teamwork.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "IETM Campus",
        image: "https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=2000",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "Treasure Hunt",
        is_team_event: true,
        max_participation: 24,
        prize: "₹300",
        coordinators: [],
        content_blocks: [
            {
                title: "How to Play",
                list: [
                    "Each team will receive the first clue at the start.",
                    "Clues must be solved in order — skipping clues is not allowed.",
                    "Teams must stay together; everyone should remain with their group throughout the hunt."
                ]
            }
        ]
    },
    {
        id: 1000,
        title: "8 Ball Pool",
        description: "Chalk up and break. A pocket billiards tournament.",
        long_description: "An 8 Ball Pool Tournament conducted in a knockout format. Precision and strategy are key.",
        date: "2026-02-12T13:30:00",
        event_date: "2026-02-12",
        time: "01:30 PM",
        venue: "court",
        image: "https://images.unsplash.com/photo-1588661803738-4e8913346d0d?auto=format&fit=crop&q=80&w=2066",
        duration: "nil",
        is_registration_open: true,
        is_paid: true,
        fee: "₹25",
        category: "Sports",
        is_team_event: false,
        max_participation: 8,
        prize: "₹200",
        coordinators: [{ name: "Aakif", phone: "" }],
        content_blocks: [
            {
                title: "Tournament Format",
                content: "Knockout format. All matches are Best of 1, except the Final which is Best of 3."
            }
        ]
    },
    {
        id: 1001,
        title: "eFootball League",
        description: "Settle it on the pitch. A mobile eSports knockout tournament.",
        long_description: "Win the league in this high-stakes eFootball mobile tournament. 32 slots, knockout format, unlimited team strength.",
        date: "2026-02-10T14:00:00",
        event_date: "2026-02-10",
        time: "online",
        venue: "online",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
        duration: "nil",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "eSports",
        is_team_event: false,
        max_participation: 32,
        prize: "₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Rules",
                list: [
                    "32 slots available.",
                    "Knockout Format Tournament.",
                    "Match Time: 8 Mins."
                ]
            }
        ]
    },
    {
        id: 1002,
        title: "Arm Wrestling",
        description: "A test of strength and endurance. Two from each class.",
        long_description: "An intense arm wrestling competition to find the strongest on campus. Limited to two participants from each class.",
        date: "2026-02-11T12:30:00",
        event_date: "2026-02-11",
        time: "12:30 PM",
        venue: "College entrance",
        image: "https://images.unsplash.com/photo-1583473848882-f9a5bb7ff2ee?auto=format&fit=crop&q=80&w=2070",
        duration: "nil",
        is_registration_open: true,
        is_paid: false,
        fee: "₹0",
        category: "Sports",
        is_team_event: false,
        max_participation: 50,
        prize: "₹0",
        coordinators: [{ name: "Farhan", phone: "" }],
        content_blocks: [
            {
                title: "Rules",
                list: [
                    "Max 2 participants from each class.",
                    "Knockout format.",
                    "Professional arm wrestling rules apply."
                ]
            }
        ]
    },
    {
        id: 1003,
        title: "Mini Militia",
        description: "Doodle Army 2: Mini Militia mobile war.",
        long_description: "Join the intense multiplayer combat in Mini Militia. Battle it out to see who becomes the ultimate soldier.",
        date: "2026-02-11T13:30:00",
        event_date: "2026-02-11",
        time: "01:30 PM",
        venue: "-1 Lecture Hall",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour 30 Mins",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "eSports",
        is_team_event: false,
        max_participation: 40,
        prize: "₹200",
        coordinators: [],
        content_blocks: [
            {
                title: "Rules",
                list: [
                    "Fair play only. No mods or cheats allowed.",
                    "Individual battle format.",
                    "Time limit: 1.5 hours."
                ]
            }
        ]
    }
];

export default eventsData;
