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
            },
            {
                title: "Rules & Guidelines",
                list: [
                    "Individual participation only",
                    "Internet access is allowed",
                    "Fixed time limit for all levels",
                    "Sharing of answers or files is strictly prohibited",
                    "Ethical hacking and fair play must be followed"
                ]
            },
            {
                title: "Winning Criteria",
                content: "The participant who successfully completes Level 3 and logs in first within the allotted time will be declared the winner of Shadow Login."
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
        is_team_event: false,
        max_participation: 20,
        coordinators: [{ name: "Jenna", phone: "" }, { name: "Anjal", phone: "" }],
        content_blocks: [
            {
                title: "The Mission",
                content: "A laptop has been left unlocked with WhatsApp Web open. The messages on the screen are completely scrambled using a custom encryption standard. Your objective is to manually decrypt the conversation, reveal the hidden messages, and extract proof of a secret relationship before time runs out."
            },
            {
                title: "Technical Brief – Cryptography Used",
                content: "This challenge is based on Monoalphabetic Substitution Decryption using a Randomized Key. Each letter in the plaintext is replaced with a randomly assigned letter, making pattern-based guessing impossible (e.g., A -> Q, B -> W). There is no formula to reverse this cipher—only the correct key works."
            },
            {
                title: "How to Decrypt (Offline Only)",
                list: [
                    "Cipher Key Printout will be provided at the start",
                    "Cross-reference each encrypted letter with the key",
                    "Manually translate the entire conversation",
                    "Speed and precision are critical"
                ]
            },
            {
                title: "Rules & Guidelines",
                list: [
                    "Offline environment — no internet or digital tools",
                    "No online solvers or cryptography software",
                    "Frequency analysis tools are prohibited",
                    "Manual decoding only (pen & paper)",
                    "Fair play and ethical conduct must be followed"
                ]
            },
            {
                title: "Proof of Work",
                content: "Participants must submit the correctly decrypted Name, Time, and Location. All details must be accurate to qualify."
            },
            {
                title: "Tools Provided",
                list: [
                    "Encrypted chat terminal",
                    "Cipher key printout",
                    "Pen and paper"
                ]
            }
        ]
    },
    {
        id: 997,
        title: "The Last Login",
        description: "Follow the digital trail. Find the truth. A digital forensics murder mystery challenge.",
        long_description: "A senior employee of an IT company has been found dead under suspicious circumstances. His system was left behind with digital traces still intact. Recovered evidence includes emails, system logs, images, and text notes. Your mission is to analyze the data, connect the clues, and identify the criminal before time runs out.",
        date: "2026-02-11T15:00:00",
        event_date: "2026-02-11",
        time: "03:00 PM",
        venue: "Computer Lab",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour 30 Mins",
        is_registration_open: true,
        is_paid: true,
        fee: "₹60",
        category: "Digital Forensics",
        is_team_event: true,
        max_participation: 30,
        prize: "₹1000",
        coordinators: [],
        content_blocks: [
            {
                title: "Event Structure",
                items: [
                    { title: "Round 1 – Lock & Key", content: "Solve short logic and observation challenges. Each correct answer reveals one digit. Arrange all digits in order to unlock the final code. Only teams that crack the code qualify." },
                    { title: "Round 2 – Investigation", content: "Access the digital case files. Analyze evidence carefully. Not all files are important. Some clues may mislead you." },
                    { title: "Round 3 – Final Verdict", content: "Submit: Culprit’s name, Motive, Method, Minimum two supporting clues." }
                ]
            },
            {
                title: "Team Details",
                list: [
                    "2-3 members per team",
                    "Individual participation is not allowed",
                    "Teams must work independently"
                ]
            },
            {
                title: "Rules",
                list: [
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
                list: [
                    "Correct suspect – 30",
                    "Correct motive – 20",
                    "Correct method – 20",
                    "Valid evidence – 20",
                    "Time efficiency – 10",
                    "Total – 100"
                ]
            }
        ]
    },
    {
        id: 998,
        title: "Buried Secrets",
        description: "Follow the money, find the liar. A social deduction game of strategy and deception.",
        long_description: "A social deduction game of strategy and deception where a hidden Mafia team conceals a treasure while civilians attempt to uncover both the truth and the treasure itself. The ultimate winner is the player who owns the treasure last at the end of the 4th round.",
        date: "2026-02-11T15:00:00",
        event_date: "2026-02-11",
        time: "03:00 PM",
        venue: "Main Venue",
        image: "https://images.unsplash.com/photo-1541560052-5e3028e05d03?auto=format&fit=crop&q=80&w=2070",
        duration: "1 Hour",
        is_registration_open: true,
        is_paid: true,
        fee: "₹50",
        category: "Social Deduction",
        is_team_event: false,
        max_participation: 13,
        prize: "₹1000",
        coordinators: [],
        content_blocks: [
            {
                title: "Game Structure",
                content: "Total players: 13. Roles: 3 Mafia, 1 Doctor, 1 Detective, 1 Broker, remaining players are Civilians. The game consists of 4 total rounds.",
                items: [
                    { title: "Hidden Phase (5 mins)", content: "The coordinator blindfolds all players. The Mafia secretly hide the treasure within the venue and return without revealing themselves." },
                    { title: "The Hunt (5 mins)", content: "All players search the venue to find the treasure." },
                    { title: "Elimination Phase", content: "Players proceed into night and day cycles to remove suspects." }
                ]
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
                title: "The Post-Hunt Cycle",
                items: [
                    { title: "Night Phase (Heads Down)", content: "All players close their eyes. Mafia silently choose a victim. Doctor selects a player to save. Detective investigates a suspect." },
                    { title: "Day Phase (Heads Up)", content: "The coordinator announces the night victim. Players debate suspicious behavior. A vote is held; the majority choice is eliminated." }
                ]
            },
            {
                title: "Core Rules",
                list: [
                    "No peeking: Eyes must be closed or blindfolds on during night phases.",
                    "Dead men tell no tales: Eliminated players must remain silent.",
                    "No reveal: Role cards cannot be shown while alive.",
                    "Trust no one. The truth is hidden behind the lies!"
                ]
            }
        ]
    },
    {
        id: 999,
        title: "Barroz: Treasure Hunt",
        description: "Unlock the mystery. Find the gold. A campus-wide treasure hunt.",
        long_description: "Teams must solve each clue in the correct order to reach the next location or puzzle. The first team to find the final treasure or solve the last clue wins. A test of wits, speed, and teamwork.",
        date: "2026-02-11T15:00:00",
        event_date: "2026-02-11",
        time: "03:00 PM",
        venue: "Campus Grounds",
        image: "https://images.unsplash.com/photo-1599939571322-792a326991f2?auto=format&fit=crop&q=80&w=2000",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "Contact Coordinator",
        category: "Treasure Hunt",
        is_team_event: true,
        max_participation: 40,
        prize: "Winner Takes All",
        coordinators: [],
        content_blocks: [
            {
                title: "Teams",
                list: [
                    "A maximum of 10 teams can participate.",
                    "Each team can have up to 4 members.",
                    "All team members must check in together at the start.",
                    "Each team will be given one set of clues to follow."
                ]
            },
            {
                title: "How to Play",
                list: [
                    "Each team will receive the first clue at the start.",
                    "Clues must be solved in order — skipping clues is not allowed.",
                    "Teams must stay together; everyone should remain with their group throughout the hunt.",
                    "Teams cannot use outside help (friends not in the hunt) to solve clues."
                ]
            },
            {
                title: "Fair Play & Safety",
                list: [
                    "No running dangerously, pushing, or interfering with other teams.",
                    "Respect property and restricted zones.",
                    "Do not move or damage clue placements.",
                    "Organizers' decisions on rule interpretations are final."
                ]
            },
            {
                title: "Winning & Prizes",
                list: [
                    "The first team to correctly solve all clues and reach the final treasure within the time limit wins.",
                    "Time limit: 2 hours.",
                    "Tie-breaker: Fastest time on key checkpoints."
                ]
            }
        ]
    },
    {
        id: 1000,
        title: "8 Ball Pool",
        description: "Chalk up and break. A 2v2 knockout tournament.",
        long_description: "An 8 Ball Pool Tournament conducted in a team format of two players each. The tournament will feature 8 teams competing in a knockout format. Precision, strategy, and teamwork are key.",
        date: "2026-02-11T13:30:00",
        event_date: "2026-02-11",
        time: "01:30 PM",
        venue: "Recreation Hall",
        image: "https://images.unsplash.com/photo-1588661803738-4e8913346d0d?auto=format&fit=crop&q=80&w=2066",
        duration: "1 Hour 30 Mins",
        is_registration_open: true,
        is_paid: true,
        fee: "Contact Coordinator",
        category: "Sports",
        is_team_event: true,
        max_participation: 16,
        prize: "Trophies",
        coordinators: [],
        content_blocks: [
            {
                title: "Tournament Format",
                content: "Knockout format with 8 teams starting from the quarterfinals. All matches are Best of 1, except the Final which is Best of 3."
            },
            {
                title: "Rules & Regulations",
                list: [
                    "Each team shall consist of two players.",
                    "Teams must play in strict alternate-shot order.",
                    "The break will be decided by a coin toss.",
                    "All fouls will result in ball-in-hand anywhere on the table.",
                    "The 8-ball must be called before attempting the final shot.",
                    "A scratch on the 8-ball results in immediate loss of frame.",
                    "Referee’s decision is final."
                ]
            }
        ]
    },
    {
        id: 1001,
        title: "eFootball League",
        description: "Settle it on the pitch. A mobile eSports knockout tournament.",
        long_description: "Win the league in this high-stakes eFootball mobile tournament. 32 slots, knockout format, unlimited team strength. Random form.",
        date: "2026-02-11T14:00:00",
        event_date: "2026-02-11",
        time: "02:00 PM",
        venue: "S4 Cyber",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071",
        duration: "2 Hours",
        is_registration_open: true,
        is_paid: true,
        fee: "₹10",
        category: "eSports",
        is_team_event: false,
        max_participation: 32,
        prize: "1st: 50% Pool, 2nd: 30% Pool",
        coordinators: [],
        content_blocks: [
            {
                title: "Rules",
                list: [
                    "1.32 slots available.",
                    "Knockout Format Tournament.",
                    "Match Time: 8 Mins.",
                    "Team Strength: Unlimited.",
                    "Player Form: Random.",
                    "Subs: 6.",
                    "Extra Time: On, Penalties: On."
                ]
            },
            {
                title: "Terms",
                list: [
                    "Every GAME is knockout.",
                    "If disconnection occurs, match resumes for remaining time only.",
                    "No double attacking and defending mode.",
                    "Follow instructions given by Admins.",
                    "Any violation of rules results in disqualification."
                ]
            }
        ]
    }
];

export default eventsData;
