# IMPI Academic Center

Welcome to the **IMPI Academic Center**, the official student portal developed for the **Academics and Profession (AKPRO)** division of the International Program at the Faculty of Engineering, Universitas Indonesia (IMPI FTUI).

This portal is designed to support International Program students in navigating university life, from daily academics to post-graduation opportunities, specifically focusing on **Student Exchange** and **Academic Resources**.

## Features

- **Modern & Responsive UI**: Built with a sleek "glassmorphism" aesthetic, subtle micro-animations, and dynamic headers. Fully optimized for both desktop and mobile devices.
- **Academic Resources (Home Tab)**: 
  - Direct access to Past Exam Archives (UAS/UTS) and Study Notes.
  - Academic Calendars for the current and past semesters.
  - Live Instagram feed preview for the latest updates and job opportunities.
- **Student Exchange Hub (Exchange Tab)**:
  - **Partner Universities Directory**: A searchable and filterable database of international partner universities (e.g., University of Queensland, Monash University, University of Birmingham).
  - Detailed pop-ups showing available majors, dual-degree schemes (e.g., 2+2, 3+1), intake periods, estimated costs, and scholarship information.
  - Quick links to specific syllabus mapping documents.
- **Interactive Modals**: Includes an 'Asistensi' scheduling modal and a dynamic Partner Universities search with real-time country filtering.
- **Appointment Booking**: Quick access to book consultation appointments with the academic center.

## Technology Stack

### Frontend
- **HTML5**: Semantic structure and accessible layout.
- **CSS3 (Vanilla)**: Custom styling utilizing CSS variables, Flexbox/Grid, media queries for responsiveness, and smooth `cubic-bezier` transitions.
- **JavaScript (Vanilla)**: Handles tab navigation, dynamic modal rendering, search/filter algorithms, and scroll-event listeners.

### Backend
- **Node.js & Express**: Custom REST API server acting as a secure middleman.
- **Supabase**: PostgreSQL database for managing Universities, Partners, Diktat, Asistensi, and Academic Calendars.

## Project Structure

```text
├── index.html       # Main HTML document and layout structure
├── styles.css       # Core stylesheet with variables, animations, and responsive rules
├── script.js        # Frontend logic for fetching data, modals, and UI interaction
├── server.js        # Node.js/Express backend API server
├── package.json     # Node.js dependencies
├── .env             # (Not in repo) Supabase URL and API Keys
├── assets/          # Directory containing all images, logos, and icons
│   ├── logo.png     
│   ├── crown.png
│   └── ...          
└── README.md        # Project documentation
```

## Getting Started

This project utilizes a Client-Server architecture. You will need to run the Node.js server for the website to fetch data from Supabase successfully.

1. Clone this repository:
   ```bash
   git clone https://github.com/GPapers00/Website-AKPRO-IMPI-FTUI.git
   ```
2. Navigate to the project folder and install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
5. Open `index.html` in your favorite web browser (Chrome, Safari, Edge, Firefox) or run it through a local extension like Live Server. The website will dynamically fetch data from your local server at `http://localhost:3000`.

## About AKPRO IMPI FTUI

**Academics and Profession (AKPRO)** is a division that focuses on fulfilling the needs of its members in the academic realm and professional development. This division serves as a liaison between the educational institution and International Program students, providing advocacy, study centers, and study information.

## License

This project is created for the internal use of IMPI FTUI. All rights reserved.
# Website-AKPRO
# Website-AKPRO
# Website-AKPRO
# Website-AKPRO-IMPI-FTUI
