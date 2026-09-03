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
 * All events are managed via the admin panel or added to this array.
 */

/** @type {Event[]} */
const eventsData = [];

export default eventsData;
