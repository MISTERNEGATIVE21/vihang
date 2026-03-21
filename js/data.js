const API_BASE_URL = "https://vihang-woya.onrender.com/api";

// Gradient colors for club capsules (edit these to change capsule colors)
const clubGradients = {
  "Ether Rox": "linear-gradient(180deg, #eeebff, #2c2083)",
  "Hydro Heroes": "linear-gradient(180deg, #b1f8fd, #2002b7)",
  "Gravitas Elites": "linear-gradient(180deg, #eadcc8, #814402)",
  Firestorm: "linear-gradient(200deg, #ffcc91,rgb(244, 42, 42))",
  "Aero Knights": "linear-gradient(180deg, #ffffff, #6e9fb6)",
};

// Helper to get gradient for a club name (falls back to solid color)
function getClubGradient(clubName, fallbackColor) {
  return clubGradients[clubName] || fallbackColor || "#ccc";
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
        "Ether Rox": {
          element: `<img src="../images/clubs_logos/club1_logo.png" alt="Ether Rox" class="club-logo">`,
          description:
            "The Ether  <br> Cosmic energy, boundless reach.",
          backgroundColor: "#f9f6fc",
          captainBoy: "Sameer Bobde",
          captainGirl: "Aabriti Saha",
          viceCaptainBoy: "Ankan Chanda",
          viceCaptainGirl: "TS Anjana",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
        },
        "Gravitas Elites": {
          element: `<img src="../images/clubs_logos/club2_logo.PNG" alt="Gravitas Elites" class="club-logo">`,
          description:
            "The Earth  <br> Steady stance, absolute strength.",
          backgroundColor: "#fcf7f2",
          captainBoy: "Rapelli S Prathik",
          captainGirl: "Kottapalli Navina",
          viceCaptainBoy: "Mohd Amjath Khan",
          viceCaptainGirl: "Sharvari K Sahare",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
        },

        "Hydro Heroes": {
          element: `<img src="../images/clubs_logos/club3_logo.png" alt="Hydro Heroes" class="club-logo">`,
          description: "Be like water <br> Calm in form, powerful in motion.",
          backgroundColor: "#eef8f6",
          captainBoy: "Vinit Vats",
          captainGirl: "Kanika Gupta",
          viceCaptainBoy: "Shivank Bramhe",
          viceCaptainGirl: "Vishu Bishnoi",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
        },
        Firestorm: {
          element: `<img src="../images/clubs_logos/club4_logo.png" alt="Firestorm" class="club-logo">`,
          description:
            "The Fire  <br> Blazing passion, relentless drive.",
          backgroundColor: "#fff8f8",
          captainBoy: "Shashi Kumar ",
          captainGirl: "Kavi Sheoran",
          viceCaptainBoy: "Shivam Yadav",
          viceCaptainGirl: "Aashtha Guptha",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
        },

        "Aero Knights": {
          element: `<img src="../images/clubs_logos/Club_5 logo.png" alt="Aero Knights" class="club-logo">`,
          description:
            "The Air  <br> Swift movement, boundless freedom.",
          backgroundColor: "#f4f9fe",
          captainBoy: "Divyansh P Singh",
          captainGirl: "Sweta Tiwari",
          viceCaptainBoy: "Yash Ingalkar",
          viceCaptainGirl: "Alisha Chandankhede",
          captainBoyImage: "👨‍💼",
          captainGirlImage: "👩‍💼",
          viceCaptainBoyImage: "👨‍💼",
          viceCaptainGirlImage: "👩‍💼",
        },
      };

      // Merge details
      clubs = clubs.map((club) => {
        const details = clubDetails[club.name] || {};
        return { ...club, ...details, id: club._id };
      });

      return clubs;
    }
  } catch (error) {
    console.error("Error fetching clubs:", error);
  }
  return [];
}

const sponsors = [
  {
    id: 1,
    name: "Sponsor Name",
    logo: "👑",
    category: "Title Sponsor",
    description: "Main sponsor for Vihaang",
  },
  {
    id: 2,
    name: "Sponsor Name",
    logo: "🌟",
    category: "Co-title Sponsor",
    description: "Co-title sponsor for Vihaang",
  },
  {
    id: 3,
    name: "Sponsor Name",
    logo: "⚡",
    category: "Equipment Sponsor",
    description: "Equipment sponsor for Vihaang events",
  },
];

const sports = [
  // Outdoor
  {
    id: 1,
    name: "Cricket",
    icon: "🏏",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  { id: 2, name: "Football", icon: "⚽", type: "Outdoor", genders: ["male"] },
  {
    id: 3,
    name: "Kho-Kho",
    icon: "🏃",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  {
    id: 4,
    name: "Throw Ball",
    icon: "🏐",
    type: "Outdoor",
    genders: ["female"],
  },
  {
    id: 5,
    name: "Basketball",
    icon: "🏀",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  {
    id: 6,
    name: "Volleyball",
    icon: "🏐",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  { id: 7, name: "Handball", icon: "🤾", type: "Outdoor", genders: ["male"] },
  {
    id: 8,
    name: "Box Cricket",
    icon: "🏏",
    type: "Outdoor",
    genders: ["neutral"],
  },
  {
    id: 9,
    name: "Swimming",
    icon: "🏊",
    type: "Outdoor",
    genders: ["male", "female"],
  },
  {
    id: 10,
    name: "Inaugural March Past",
    icon: "🚶",
    type: "Outdoor",
    genders: ["neutral"],
  },

  // Indoor
  {
    id: 11,
    name: "Badminton",
    icon: "🏸",
    type: "Indoor",
    genders: ["male", "female", "mixed"],
  },
  {
    id: 12,
    name: "Table Tennis",
    icon: "🏓",
    type: "Indoor",
    genders: ["male", "female"],
  },
  {
    id: 13,
    name: "Carrom",
    icon: "🎯",
    type: "Indoor",
    genders: ["male", "female"],
  },
  {
    id: 14,
    name: "Chess",
    icon: "♟️",
    type: "Indoor",
    genders: ["male", "female"],
  },
  {
    id: 15,
    name: "Powerlifting",
    icon: "🏋️",
    type: "Indoor",
    genders: ["male"],
  },
  { id: 16, name: "Yoga", icon: "🧘", type: "Indoor", genders: ["neutral"] },

  // E-Sports
  { id: 17, name: "BGMI", icon: "📱", type: "E-Sports", genders: ["neutral"] },
  {
    id: 18,
    name: "Valorant",
    icon: "💻",
    type: "E-Sports",
    genders: ["neutral"],
  },

  // Athletics
  {
    id: 21,
    name: "Discus Throw",
    icon: "🥏",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 22,
    name: "Javelin Throw",
    icon: "🏹",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 23,
    name: "Marathon",
    icon: "🏃",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 24,
    name: "Relay 4x100m",
    icon: "🏃‍♂️",
    type: "Athletics",
    genders: ["male"],
  },
  {
    id: 25,
    name: "Shot Put",
    icon: "⚫",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 26,
    name: "Slow Cycling",
    icon: "🚴",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 27,
    name: "Sprint 100m",
    icon: "🏃",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 28,
    name: "Sprint 200m",
    icon: "🏃",
    type: "Athletics",
    genders: ["male", "female"],
  },
  {
    id: 29,
    name: "Triathlon Relay",
    icon: "🏃",
    type: "Athletics",
    genders: ["neutral"],
  },
  {
    id: 30,
    name: "Long Jump",
    icon: "🦘",
    type: "Athletics",
    genders: ["male"],
  },
  {
    id: 31,
    name: "Swimming 100m",
    icon: "🏊",
    type: "Athletics",
    genders: ["male"],
  },
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
  { id: 23, name: "Vihang Letters" },
];

// Mobile Navbar Logic - Global
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("is-active");
      navLinks.classList.toggle("active");

      if (navbar) {
        navbar.classList.toggle("menu-active");
      }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-active");
        navLinks.classList.remove("active");
        if (navbar) {
          navbar.classList.remove("menu-active");
        }
      });
    });
  }
});
