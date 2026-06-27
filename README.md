# IMPI Academic Center

Welcome to the **IMPI Academic Center**, the official student portal developed for the **Academics and Profession (AKPRO)** division of the International Program at the Faculty of Engineering, Universitas Indonesia (IMPI FTUI).

This portal is designed to support International Program students in navigating university life, from daily academics to post-graduation opportunities, specifically focusing on **Student Exchange** and **Academic Resources**.

## Features

- **Modern & Responsive UI**: Built with a sleek "glassmorphism" aesthetic, subtle micro-animations, and dynamic headers. Fully optimized for both desktop and mobile devices.
- **Academic Resources (Home Tab)**: 
  - Direct access to Past Exam Archives (UAS/UTS) and Study Notes via the Diktat module.
  - Academic Calendars for the current and past semesters.
  - Live Instagram feed preview for the latest updates and job opportunities.
- **Student Exchange Hub (Exchange Tab)**:
  - **Partner Universities Directory**: A searchable and filterable database of international partner universities (e.g., University of Queensland, Monash University, University of Birmingham).
  - **Open Opportunities**: Live data of actively open exchange programs, automatically scraped from the UI International Office.
  - Detailed pop-ups showing available majors, dual-degree schemes, intake periods, estimated costs, and scholarship information.
- **Interactive Modals**: Includes an 'Asistensi' scheduling modal and a dynamic Partner Universities search with real-time country filtering.

## Technology Stack

### Frontend (Serverless Architecture)
- **HTML5**: Semantic structure and accessible layout.
- **CSS3 (Vanilla)**: Custom styling utilizing CSS variables, Flexbox/Grid, media queries for responsiveness, and smooth `cubic-bezier` transitions.
- **JavaScript (ES6 Modules)**: Highly modular vanilla JavaScript (`js/` directory) that handles tab navigation, dynamic modal rendering, search algorithms, and direct database querying.

### Database & Backend
- **Supabase (PostgreSQL)**: Acts as a serverless backend. The frontend connects directly to Supabase using an Anonymous Key and Row-Level Security (RLS) to safely fetch Universities, Partners, Diktat, Asistensi, and Academic Calendars.

### Data Automation
- **Python Scraper**: A lightweight `scraper.py` script that periodically scrapes the UI International website for new Exchange Opportunities, filters out non-undergraduate programs, and directly updates the Supabase database.

## Project Structure

```text
├── index.html       # Main HTML document and layout structure
├── styles.css       # Core stylesheet with variables, animations, and responsive rules
├── js/              # Modular ES6 JavaScript files
│   ├── main.js      # Entry point
│   ├── supabase.js  # Supabase client initialization
│   ├── navigation.js# Tab and scroll logic
│   ├── home.js      # Open opportunities and calendar logic
│   ├── exchange.js  # Partner universities and asistensi logic
│   └── diktat.js    # Diktat archive logic
├── scraper.py       # Python script for scraping exchange opportunities
├── .env             # (Not in repo) Supabase URL and API Keys for scraper.py
├── assets/          # Directory containing all images, logos, and icons
└── README.md        # Project documentation
```

## Getting Started

Because the project now uses a serverless architecture with **ES6 Modules**, you no longer need a Node.js backend to run the website. However, you do need a basic local web server to bypass CORS restrictions for the ES6 `import` statements.

1. Clone this repository:
   ```bash
   git clone https://github.com/GPapers00/Website-AKPRO-IMPI-FTUI.git
   ```
2. Open the folder in **Visual Studio Code**.
3. Install the **"Live Server"** extension in VS Code.
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. The website will automatically launch in your browser and connect to your Supabase database!

### Updating Exchange Opportunities (Scraper)

To run the python scraper and update your database with the latest open opportunities:
1. Ensure you have Python installed.
2. Create a `.env` file in the root directory and add your Supabase credentials (this is required for the scraper to write to the DB):
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   ```
3. Run the script:
   ```bash
   python scraper.py
   ```

## About AKPRO IMPI FTUI

**Academics and Profession (AKPRO)** is a division that focuses on fulfilling the needs of its members in the academic realm and professional development. This division serves as a liaison between the educational institution and International Program students, providing advocacy, study centers, and study information.

## License

This project is created for the internal use of IMPI FTUI. All rights reserved.