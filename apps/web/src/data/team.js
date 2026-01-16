// ===================================================================================
// TEAM CONFIGURATION
// ===================================================================================
// Defines the Faculty Advisors and Core Team Members for the About Page.
//
// HOW TO UPDATE:
// 1. Add or remove objects from the arrays below.
// 2. 'image': Put your image files in the 'public' folder (e.g., 'public/team/photo.jpg')
//    and use the path '/team/photo.jpg'. Or use an external URL.
//    If you leave 'image' empty (""), a placeholder will be shown.
// ===================================================================================

export const facultyMembers = [
    {
        name: "Thara Krishnan R", 
        role: "Assistant Professor",    
        image: "images/hod.jpg", // Upload photo to public/images/thara.jpg and update this path
        id: "FAC-01"
    },
    {
        name: "Aswani K M",
        role: "Assistant Professor",
        image: "images/aswani.jpeg", // Upload photo to public/images/aswani.jpg and update this path
        id: "FAC-02"
    },
    {
        name: "Afeefa A K",
        role: "Assistant Professor",
        image: "images/afeefa.jpg", // Upload photo to public/images/afeefa.jpg and update this path
        id: "FAC-03"
    },
    {
        name: "Shalna P Latheef",
        role: "Assistant Professor",
        image: "images/shalna.jpeg", // Upload photo to public/images/shalna.jpg and update this path
        id: "FAC-04"
    }

    
];

export const coreMembers = [
    {
        name: "Midlaj",
        role: "President",
        image: "",               // <--- Add image path here
        id: "AST-01",
        level: "05"              // Just a decorative level number (01-99)
    },
    {
        name: "Sanjay vinod",
        role: "Vice President",
        image: "",
        id: "AST-02",
        level: "04"
    },
    {
        name: "Student Name",
        role: "Secretary",
        image: "",
        id: "AST-03",
        level: "04"
    },
    {
        name: "Student Name",
        role: "Tech Lead",
        image: "",
        id: "AST-04",
        level: "04"
    }

    
];
