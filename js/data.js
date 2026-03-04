
const API_BASE_URL = 'https://vihang-woya.onrender.com/api';

// Gradient colors for club capsules (edit these to change capsule colors)
const clubGradients = {
    "Agni":         "linear-gradient(200deg, #ffcc91,rgb(244, 42, 42))",
    "Hydro Heros":  "linear-gradient(180deg, #b1f8fd, #2002b7)",
    "Prithvi":      "linear-gradient(180deg, #eadcc8, #814402)",
    "Vayu":         "linear-gradient(180deg, #87CEEB, #54a0ff)",
    "Ether Rockz":  "linear-gradient(180deg, #483D8B, #6c5ce7)",
};

// Helper to get gradient for a club name (falls back to solid color)
function getClubGradient(clubName, fallbackColor) {
    return clubGradients[clubName] || fallbackColor || '#ccc';
}

// Clubs data will be fetched from backend
let clubs = [];

// Function to fetch clubs data from backend
async function fetchClubsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/clubs`);
        if (response.ok) {
            clubs = await response.json();

            // Map the icons and full descriptions to the dynamic data since backend only saves basic theme details
            const clubDetails = {
                "Agni": { element: "🔥", 
                    description: "The Fire element - representing energy, passion, and determination.", 
                    backgroundColor: "#fff8f8", 
                    captainBoy: "Shashi ", 
                    captainGirl: "Priya Singh", 
                    viceCaptainBoy: "Rajesh Nair", 
                    viceCaptainGirl: "Ananya Verma", 
                    captainBoyImage: "👨‍💼",
                     captainGirlImage: "👩‍💼", 
                    viceCaptainBoyImage: "👨‍💼", 
                    viceCaptainGirlImage: "👩‍💼" },
                "Hydro Heros": { element: "💧", 
                    description: "Be like water — calm in form, powerful in motion.", 
                    backgroundColor: "#eef8f6", 
                    captainBoy: "Vinit Vats", 
                    captainGirl: "Kanika Gupta", 
                    viceCaptainBoy: "Shivank Bramhe ", 
                    viceCaptainGirl: "Vishu Bishnoi ", 
                    captainBoyImage: "👨‍💼",
                     captainGirlImage: "👩‍💼", 
                     viceCaptainBoyImage: "👨‍💼", 
                     viceCaptainGirlImage: "👩‍💼" },
                "Prithvi": { element: "🌍",
                     description: "The Earth element - representing stability, strength, and grounding.", 
                     backgroundColor: "#fcf7f2",
                     captainBoy: "Vikram Sharma",
                      captainGirl: "Neha Verma", 
                      viceCaptainBoy: "Sanjay Kumar", 
                      viceCaptainGirl: "Divya Nair", 
                      captainBoyImage: "👨‍💼", 
                      captainGirlImage: "👩‍💼", 
                      viceCaptainBoyImage: "👨‍💼", 
                      viceCaptainGirlImage: "👩‍💼" },
                "Vayu": { element: "💨", 
                    description: "The Air element - representing freedom, movement, and communication.", 
                    backgroundColor: "#f4f9fe",
                     captainBoy: "Rohit Menon", 
                     captainGirl: "Divya Nair", 
                     viceCaptainBoy: "Arun Mishra", 
                     viceCaptainGirl: "Riya Choudhury", 
                     captainBoyImage: "👨‍💼", 
                     captainGirlImage: "👩‍💼", 
                     viceCaptainBoyImage: "👨‍💼", 
                     viceCaptainGirlImage: "👩‍💼" },
                "Ether Rockz": { element: "🌌", 
                    description: "The Space/Ether element - representing cosmic energy and boundless possibilities.",
                     backgroundColor: "#f9f6fc", 
                     captainBoy: "Sameer",
                      captainGirl: "Abrithi", 
                      viceCaptainBoy: "Vikash Singh", 
                      viceCaptainGirl: "Shreya Sharma", 
                      captainBoyImage: "👨‍💼",
                       captainGirlImage: "👩‍💼",
                        viceCaptainBoyImage: "👨‍💼", 
                        viceCaptainGirlImage: "👩‍💼" }
            };

            // Merge details
            clubs = clubs.map(club => {
                const details = clubDetails[club.name] || {};
                return { ...club, ...details, id: club._id };
            });

            return clubs;
        }
    } catch (error) {
        console.error('Error fetching clubs:', error);
    }
    return [];
}

// Organizers Data
const organizers = [
    {
        id: 1,
        name: "Dr. Ramesh Verma",
        role: "Chief Organizer",
        image: "👨‍💼",
        bio: "Visionary leader with 15+ years of experience in organizing youth events and competitions.",
        category: "faculty"
    },
    {
        id: 2,
        name: "Ms. Priya Sharma",
        role: "Co-Organizer",
        image: "👩‍💼",
        bio: "Passionate about fostering teamwork and excellence among students.",
        category: "faculty"
    },
    {
        id: 3,
        name: "Mr. Sanjay Patel",
        role: "Sports Coordinator",
        image: "👨‍💼",
        bio: "Dedicated sports enthusiast focused on building competitive sports culture.",
        category: "committee"
    },
    {
        id: 4,
        name: "Ms. Anjali Gupta",
        role: "Cultural Events Lead",
        image: "👩‍💼",
        bio: "Creative director dedicated to celebrating cultural talents and diversity.",
        category: "committee"
    },
    {
        id: 5,
        name: "Mr. Rohit Kumar",
        role: "Finance & Operations",
        image: "👨‍💼",
        bio: "Ensures smooth operations and fair management of all competitions.",
        category: "committee"
    }
];


const sponsors = [
    {
        id: 1,
        name: "Sponsor Name",
        logo: "👑",
        category: "Title Sponsor",
        description: "Main sponsor for Vihaang"
    },
    {
        id: 2,
        name: "Sponsor Name",
        logo: "🌟",
        category: "Co-title Sponsor",
        description: "Co-title sponsor for Vihaang"
    },
    {
        id: 3,
        name: "Sponsor Name",
        logo: "⚡",
        category: "Equipment Sponsor",
        description: "Equipment sponsor for Vihaang events"
    }
];


const sports = [
    // Outdoor
    { id: 1, name: "Cricket", icon: "🏏", type: "Outdoor", genders: ["male", "female"] },
    { id: 2, name: "Football", icon: "⚽", type: "Outdoor", genders: ["male"] },
    { id: 3, name: "Kho-Kho", icon: "🏃", type: "Outdoor", genders: ["male", "female"] },
    { id: 4, name: "Throw Ball", icon: "🏐", type: "Outdoor", genders: ["female"] },
    { id: 5, name: "Basketball", icon: "🏀", type: "Outdoor", genders: ["male", "female"] },
    { id: 6, name: "Volleyball", icon: "🏐", type: "Outdoor", genders: ["male", "female"] },
    { id: 7, name: "Handball", icon: "🤾", type: "Outdoor", genders: ["male"] },
    { id: 8, name: "Box Cricket", icon: "🏏", type: "Outdoor", genders: ["neutral"] },
    { id: 9, name: "Swimming", icon: "🏊", type: "Outdoor", genders: ["male", "female"] },
    { id: 10, name: "Inaugural March Past", icon: "🚶", type: "Outdoor", genders: ["neutral"] },

    // Indoor
    { id: 11, name: "Badminton", icon: "🏸", type: "Indoor", genders: ["male", "female", "mixed"] },
    { id: 12, name: "Table Tennis", icon: "🏓", type: "Indoor", genders: ["male", "female"] },
    { id: 13, name: "Carrom", icon: "🎯", type: "Indoor", genders: ["male", "female"] },
    { id: 14, name: "Chess", icon: "♟️", type: "Indoor", genders: ["male", "female"] },
    { id: 15, name: "Powerlifting", icon: "🏋️", type: "Indoor", genders: ["male"] },
    { id: 16, name: "Yoga", icon: "🧘", type: "Indoor", genders: ["neutral"] },

    // E-Sports
    { id: 17, name: "BGMI", icon: "📱", type: "E-Sports", genders: ["neutral"] },
    { id: 18, name: "Valorant", icon: "💻", type: "E-Sports", genders: ["neutral"] },

    // Athletics
    { id: 21, name: "Discus Throw", icon: "🥏", type: "Athletics", genders: ["male", "female"] },
    { id: 22, name: "Javelin Throw", icon: "🏹", type: "Athletics", genders: ["male", "female"] },
    { id: 23, name: "Marathon", icon: "🏃", type: "Athletics", genders: ["male", "female"] },
    { id: 24, name: "Relay 4x100m", icon: "🏃‍♂️", type: "Athletics", genders: ["male"] },
    { id: 25, name: "Shot Put", icon: "⚫", type: "Athletics", genders: ["male", "female"] },
    { id: 26, name: "Slow Cycling", icon: "🚴", type: "Athletics", genders: ["male", "female"] },
    { id: 27, name: "Sprint 100m", icon: "🏃", type: "Athletics", genders: ["male", "female"] },
    { id: 28, name: "Sprint 200m", icon: "🏃", type: "Athletics", genders: ["male", "female"] },
    { id: 29, name: "Triathlon Relay", icon: "🏃", type: "Athletics", genders: ["neutral"] },
    { id: 30, name: "Long Jump", icon: "🦘", type: "Athletics", genders: ["male"] },
    { id: 31, name: "Swimming 100m", icon: "🏊", type: "Athletics", genders: ["male"] }
];

const cultureEvents = [
    { id: 1, name: "Debate (English)" },
    { id: 2, name: "Debate (Hindi)" },
    { id: 3, name: "Poetry (English)" },
    { id: 4, name: "Poetry (Hindi)" },
    { id: 5, name: "Quiz" },
    { id: 6, name: "Pic of the Day" },
    { id: 7, name: "Reel of the Day" },
    { id: 8, name: "Meme of the Day" },
    { id: 9, name: "Pic of Vihang" },
    { id: 10, name: "Flash Mob" },
    { id: 11, name: "Face Painting" },
    { id: 12, name: "Short Film" },
    { id: 13, name: "Instrumental" },
    { id: 14, name: "Solo Dance" },
    { id: 15, name: "Duo Dance" },
    { id: 16, name: "Group Dance" },
    { id: 17, name: "Solo Singing" },
    { id: 18, name: "Duet Singing" },
    { id: 19, name: "Group Singing" },
    { id: 20, name: "Rangoli" },
    { id: 21, name: "Poster Making" },
    { id: 22, name: "Treasure Hunt" },
    { id: 23, name: "Vihang Letters" }
];

// Mobile Navbar Logic - Global
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            navLinks.classList.toggle('active');

            if (navbar) {
                navbar.classList.toggle('menu-active');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                navLinks.classList.remove('active');
                if (navbar) {
                    navbar.classList.remove('menu-active');
                }
            });
        });
    }
});
