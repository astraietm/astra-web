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
        date: "2026-02-12T11:00:00",
        event_date: "2026-02-12",
        time: "11:00 AM",
        venue: "CCF/BCA Lab",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        duration: "1 Hour 30 Mins",
        is_registration_open: true,
        is_paid: true,
        fee: "₹50",
        category: "CTF Challenge",
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
        date: "2026-02-21",
        event_date: "2026-02-21",
        time: "11:00 AM",
        venue: "Cyber Lab 2",
        image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070",
        duration: "1.5 Hours",
        is_registration_open: true,
        category: "Cryptanalysis Challenge",
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
    }
];

export default eventsData;
