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
        title: "Cyber Security Summit 2024",
        date: "October 15, 2024",
        venue: "Main Auditorium",
        description: "The biggest gathering of security professionals, featuring keynote speakers from industry leaders.",
        category: "Conference",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
        registration_config: {
            isOpen: true, // SET TO FALSE TO CLOSE REGISTRATION
            deadline: "2024-10-14",
            fields: [
                { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
                { name: "email", label: "Email Address", type: "email", required: true, placeholder: "john@example.com" },
                { name: "organization", label: "Organization / College", type: "text", required: true, placeholder: "KMCT IETM" },
                { name: "role", label: "Role", type: "select", options: ["Student", "Professional", "Faculty"], required: true }
            ]
        }
    },
    {
        id: 2,
        title: "CTF Championship",
        date: "November 5, 2024",
        venue: "Computer Science Dept",
        description: "A 24-hour Capture The Flag competition. Test your skills in web exploitation, cryptography, and reverse engineering.",
        category: "Competition",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070",
        registration_config: {
            isOpen: true,
            fields: [
                { name: "teamName", label: "Team Name", type: "text", required: true, placeholder: "CyberWarriors" },
                { name: "leaderEmail", label: "Team Leader Email", type: "email", required: true, placeholder: "leader@team.com" },
                { name: "members", label: "Team Members (comma separated)", type: "text", required: true, placeholder: "Alice, Bob, Charlie" }
            ]
        }
    },
    {
        id: 3,
        title: "Ethical Hacking Workshop",
        date: "November 12, 2024",
        venue: "Lab 3",
        description: "Hands-on workshop on network security and penetration testing tools.",
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1563206767-5b1d972e9fb9?auto=format&fit=crop&q=80&w=2073",
        // No registration config = "Registration Closed" or "Info Only" by default
        // Add 'registration_link' for external forms (e.g., Google Forms)
    },
    {
        id: 4,
        title: "Tech Talk: Zero Trust",
        date: "November 20, 2024",
        venue: "Seminar Hall",
        description: "Deep dive into Zero Trust architecture and why it's the future of enterprise security.",
        category: "Talk",
        image: "https://images.unsplash.com/photo-1558494949-efc5270f9c01?auto=format&fit=crop&q=80&w=2002"
    },
    {
        id: 5,
        title: "Networking Night",
        date: "December 1, 2024",
        venue: "Campus Cafe",
        description: "Connect with alumni and industry professionals in an informal setting.",
        category: "Networking",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=2070"
    },
    {
        id: 6,
        title: "Winter Hackathon",
        date: "December 15, 2024",
        venue: "Online / Hybrid",
        description: "Build innovative security tools and solutions in this 48-hour hackathon.",
        category: "Hackathon",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=2070"
    }
];

export default eventsData;
