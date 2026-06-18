/* ============================================================
   GOOGLE STITCH - UNIVERSITY STUDENT PORTAL
   Frontend JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Tab Navigation Logic ────────────────────────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Get the target tab identifier
      const targetTab = btn.getAttribute('data-tab');

      // 2. Remove active class from all buttons and panels
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // 3. Add active class to the clicked button
      btn.classList.add('active');

      // 4. Find the corresponding panel and activate it
      const targetPanel = document.getElementById(`panel-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // 5. Manage YouTube Video Playback
      const youtubeIframe = document.querySelector('.about-us-video iframe');
      if (youtubeIframe) {
        if (targetTab === 'home') {
          // Play video when returning to home tab
          youtubeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
          // Pause video when leaving home tab
          youtubeIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      }
    });
  });

  // ── Logo Navigation Logic ───────────────────────────────────
  const logoBtn = document.getElementById('logo-btn');
  const homeTabBtn = document.querySelector('.tab-btn[data-tab="home"]');

  if (logoBtn && homeTabBtn) {
    logoBtn.addEventListener('click', () => {
      homeTabBtn.click();
    });
  }

  // ── Edit Icon Interaction (Mock Functionality) ──────────────
  const editIcons = document.querySelectorAll('.icon-edit');

  editIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      // Toggle between edit and check (save) icon for visual feedback
      if (this.textContent === 'edit_square') {
        this.textContent = 'check_circle';
        this.style.color = 'var(--cerulean-blue)';
      } else {
        this.textContent = 'edit_square';
        this.style.color = '';
      }
    });
  });

  // ── University Modal Logic ──────────────────────────────────
  const universitiesData = [
    {
      name: "University of Queensland",
      country: "Australia",
      logo: "UQ.webp",
      majors: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Architecture", "Chemical Engineering", "Industrial Engineering", "Bioprocess Engineering"],
      scheme: "2 + 2 (or 3 + 1.5 for Industrial Engineering)",
      intake: "July or February",
      cost: "AUD $32,400 / year",
      tuition: "AUD $53,760 (Engineering), AUD $47,200 (Architecture), AUD $50,560 (Business Management). (Note: 2025 data, increases 5-9% per year)",
      scholarship: "25% tuition fee reduction",
      degree: "Bachelor of Engineering (Hons) (Civil / Chemical / Chemical–Bioprocess / Electrical / Mechanical), Bachelor of Architectural Design, or Bachelor of Business Management"
    },
    {
      name: "Monash University",
      country: "Australia",
      logo: "monash.png",
      majors: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Metallurgical & Material Engineering", "Architecture", "Chemical Engineering", "Bioprocess Engineering", "Environmental Engineering", "Computer Engineering"],
      scheme: "2 + 2 (or 2 + 2.5 for Computer Engineering)",
      intake: "July or February",
      cost: "AUD $33,600 / year",
      tuition: "AUD $56,300 (Engineering), AUD $49,800 (Architecture). (Note: 2025 data, increases 2-6% per year)",
      scholarship: "AUD $5,000 tuition fee reduction per semester",
      degree: "Bachelor of Civil / Mechanical / Electrical & Computer Systems / Materials / Chemical / Environmental / Software Engineering (Hons), or Bachelor of Architectural Design"
    },
    {
      name: "Queensland University of Technology",
      country: "Australia",
      logo: "qut.png",
      majors: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Architecture", "Interior Architecture"],
      scheme: "2 + 2",
      intake: "July or February",
      cost: "AUD $32,400 / year",
      tuition: "AUD $45,500 (Engineering), AUD $39,200 (Architecture). (Note: 2025 data, increases 6-12% per year)",
      scholarship: "25% tuition fee reduction. (An additional 25% tuition fee reduction is available for the best students, 2 quotas per year)",
      degree: "Bachelor of Engineering (Hons) (Civil / Mechanical / Electrical), or Bachelor of Design (Architecture)"
    },
    {
      name: "Curtin University",
      country: "Australia",
      logo: "Curtin.png",
      majors: ["Metallurgical & Material Engineering", "Architecture"],
      scheme: "2 + 2",
      intake: "July or February",
      cost: "AUD $30,000 / year",
      tuition: "AUD $39,382 (Engineering), AUD $36,248 (Architecture). (Note: 2025 data, increases 5-6% per year)",
      scholarship: "25% tuition fee reduction for the 1st semester (Architecture) / 25% tuition fee reduction for the 1st year (Engineering)",
      degree: "Bachelor of Engineering (Materials Engineering), or Bachelor of Applied Science (Architectural Science)"
    },
    {
      name: "University of Sydney",
      country: "Australia",
      logo: "sydney.svg",
      majors: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"],
      scheme: "2 + 2",
      intake: "July or February",
      cost: "AUD $33,600 / year",
      tuition: "AUD $57,700. (Note: 2025 data, increases 3-5% per year)",
      scholarship: "20% tuition fee reduction",
      degree: "Bachelor of Engineering Honours (Civil / Mechanical / Chemical and Biomolecular / Electrical)"
    },
    {
      name: "University of Duisburg-Essen",
      country: "Germany",
      logo: "duisburg.png",
      majors: ["Electrical Engineering", "Metallurgical & Material Engineering"],
      scheme: "3 + 1",
      intake: "October",
      cost: "€14,000 / year",
      tuition: "None. (However, a mandatory Block Bank Account of €12,000 / year is required)",
      scholarship: "None",
      degree: "Bachelor of Science in Metallurgy and Metal Forming, or Bachelor of Science in Electrical and Electronic Engineering"
    },
    {
      name: "University of Strathclyde",
      country: "United Kingdom",
      logo: "strathclyde.png",
      majors: ["Mechanical Engineering", "Naval Architecture & Marine Engineering"],
      scheme: "2 + 2",
      intake: "September",
      cost: "£15,600 / year",
      tuition: "£29,350 / year. (Note: 2025 data, increases 3-5% per year)",
      scholarship: "20% tuition fee reduction",
      degree: "Bachelor of Engineering (Hons) in Mechanical Engineering / Naval Architecture with Ocean Engineering / High Performance Marine Vehicles / Marine Engineering"
    },
    {
      name: "University of Birmingham",
      country: "United Kingdom",
      logo: "birmingham.webp",
      majors: ["Chemical Engineering"],
      scheme: "2 + 2",
      intake: "September",
      cost: "£15,600 / year",
      tuition: "£31,050 / year. (Note: 2025 data, increases 6-12% per year)",
      scholarship: "20% tuition fee reduction",
      degree: "Bachelor of Engineering (Hons)"
    },
    {
      name: "University of Glasgow",
      country: "United Kingdom",
      logo: "glasglow.jpg",
      majors: ["Civil Engineering", "Electrical Engineering"],
      scheme: "2 + 2",
      intake: "September",
      cost: "£15,600 / year",
      tuition: "£31,800 / year. (Note: 2025 data, increases 3-5% per year)",
      scholarship: "20% tuition fee reduction",
      degree: "Bachelor of Engineering (Hons)"
    },
    {
      name: "University of Manchester",
      country: "United Kingdom",
      logo: "manchester.webp",
      majors: ["Chemical Engineering"],
      scheme: "2 + 2",
      intake: "September",
      cost: "£15,000 / year",
      tuition: "£36,000 / year. (Note: 2025 data, increases 3-5% per year)",
      scholarship: "20% tuition fee reduction (to be confirmed)",
      degree: "Bachelor of Engineering"
    },
    {
      name: "RMIT University",
      country: "Australia",
      logo: "RMIT.png",
      majors: ["Interior Architecture"],
      scheme: "Coming Soon",
      intake: "Coming Soon",
      cost: "Coming Soon",
      tuition: "Coming Soon",
      scholarship: "Coming Soon",
      degree: "Coming Soon"
    }
  ];

  const deptCards = document.querySelectorAll('.dept-card');
  const uniModal = document.getElementById('uni-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalMajorTitle = document.getElementById('modal-major-title');
  const modalContent = document.getElementById('modal-content');

  if (deptCards.length > 0 && uniModal) {
    deptCards.forEach(card => {
      card.addEventListener('click', () => {
        const major = card.getAttribute('data-major');
        if (!major) return;

        // Find universities that support this major
        const matchedUniversities = universitiesData.filter(uni => uni.majors.includes(major));

        // Update modal title
        modalMajorTitle.textContent = major + " - Partner Universities";

        // Generate HTML for universities
        let htmlContent = '';
        if (matchedUniversities.length === 0) {
          htmlContent = '<div style="text-align:center; padding: 40px 20px;"><span class="material-symbols-outlined" style="font-size: 48px; color: var(--text-muted); margin-bottom: 12px; display:block;">database</span><h4 style="font-size: 20px; color: var(--bear-brown); margin:0 0 8px 0;">Incomplete Database</h4><p style="color:var(--text-muted); margin:0;">There are currently no partner universities listed for this major.</p></div>';
        } else {
          matchedUniversities.forEach(uni => {
            htmlContent += `
              <div class="uni-card animate-up">
                <div class="uni-logo-col">
                  <img src="${uni.logo}" alt="${uni.name} Logo" class="uni-logo" loading="lazy" onerror="this.src='logo.png'">
                  <span class="uni-country">${uni.country}</span>
                </div>
                <div class="uni-details-col">
                  <h4 class="uni-name">${uni.name}</h4>
                  <div class="uni-detail-item">
                    <span class="material-symbols-outlined">schedule</span>
                    <strong>Scheme:</strong> <span>${uni.scheme}</span>
                  </div>
                  <div class="uni-detail-item">
                    <span class="material-symbols-outlined">calendar_today</span>
                    <strong>Intake:</strong> <span>${uni.intake}</span>
                  </div>
                  <div class="uni-detail-item">
                    <span class="material-symbols-outlined">payments</span>
                    <strong>Living Cost:</strong> <span>${uni.cost}</span>
                  </div>
                  <div class="uni-detail-item">
                    <span class="material-symbols-outlined">account_balance</span>
                    <strong>Tuition Fee:</strong> <span>${uni.tuition}</span>
                  </div>
                  <div class="uni-detail-item">
                    <span class="material-symbols-outlined">card_membership</span>
                    <strong>Scholarship:</strong> <span>${uni.scholarship}</span>
                  </div>
                  <div class="uni-detail-item">
                    <span class="material-symbols-outlined">workspace_premium</span>
                    <strong>Degree:</strong> <span>${uni.degree}</span>
                  </div>
                </div>
              </div>
            `;
          });
        }

        modalContent.innerHTML = htmlContent;

        // Show modal
        uniModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling in background
      });
    });

    // Close Modal Logic
    const closeModal = () => {
      uniModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);

    // Close when clicking outside modal container
    uniModal.addEventListener('click', (e) => {
      if (e.target === uniModal) {
        closeModal();
      }
    });
  }

  // ── Partner Universities Directory Logic ───────────────────────
  const partnerUniversitiesData = [
    { country: "Armenia", code: "am", universities: [{ name: "Yerevan State University", period: "2021 – 2026" }] },
    {
      country: "Australia", code: "au", universities: [
        { name: "Australian National University", period: "2025 – 2030" }, { name: "Curtin University", period: "2026 – 2031" },
        { name: "Deakin University", period: "2022 – 2027" }, { name: "Macquarie University", period: "2024 – 2029" },
        { name: "Monash University", period: "2023 – 2028" }, { name: "Swinburne University of Technology", period: "2022 – 2025" },
        { name: "University of Canberra", period: "2024 – 2029" }, { name: "University of Melbourne (Faculty of Administration Sciences)", period: "2025 – 2030" },
        { name: "University of Queensland", period: "2025 – 2030" }, { name: "University of Sydney", period: "2021 – 2026" },
        { name: "University of Technology Sydney", period: "2025 – 2030" }
      ]
    },
    { country: "Bosnia & Herzegovina", code: "ba", universities: [{ name: "University of Tuzla", period: "2024 – 2029" }] },
    { country: "Canada", code: "ca", universities: [{ name: "Queen's University at Kingston", period: "2022 – 2027" }] },
    {
      country: "Czech Republic", code: "cz", universities: [
        { name: "Tomas Bata University", period: "2023 – 2028" }, { name: "University of Ostrava", period: "2024 – 2029" },
        { name: "VSB - Technical University of Ostrava", period: "2022 – 2027" }, { name: "University of Pardubice (Faculty of Communication Sciences)", period: "2025 – 2027" }
      ]
    },
    { country: "Denmark", code: "dk", universities: [{ name: "University of Southern Denmark", period: "2023 – 2028" }] },
    { country: "Finland", code: "fi", universities: [{ name: "Aalto University (Faculty of Engineering)", period: "2022 – 2027" }] },
    {
      country: "France", code: "fr", universities: [
        { name: "EDHEC Business School (Faculty of Economics and Business)", period: "2025 – 2030" }, { name: "Emlyon Business School (Faculty of Economics and Business)", period: "2026 – 2031" },
        { name: "ESTACA", period: "2024 – 2029" }, { name: "La Rochelle Université", period: "2022 – 2027" },
        { name: "National Institute for Oriental Languages & Civilizations (INALCO)", period: "2027 – 2031" }, { name: "Paris 1 Panthéon-Sorbonne University", period: "2023 – 2028" },
        { name: "Science Po", period: "2022 – 2027" }, { name: "Université de Lorraine (Faculty of Humanities)", period: "2021 – 2026" },
        { name: "Université de Rennes 1 (Faculty of Engineering)", period: "2021 – 2026" }, { name: "Université de Toulouse (INSA)", period: "2022 – 2027" },
        { name: "Université Polytechnique Hauts-de-France (UPHF) - INSA HF (Faculty of Engineering)", period: "2022 – 2027" }, { name: "University of Angers", period: "2026 – 2031" },
        { name: "University of Burgundy", period: "2024 – 2029" }, { name: "University of Montpellier", period: "2025 – 2030" }
      ]
    },
    { country: "Georgia", code: "ge", universities: [{ name: "Tbilisi State University (TSU)", period: "2022 – 2027" }] },
    {
      country: "Germany", code: "de", universities: [
        { name: "Friedrich-Alexander-Universität Erlangen-Nürnberg (Faculty of Economics and Business)", period: "2022 – 2027" },
        { name: "Hochschule Konstanz (HTWG) – University of Applied Science (Faculty of Economics and Business)", period: "2021 – 2026" },
        { name: "HWR Berlin", period: "2025 – 2030" }, { name: "Kiel University of Applied Science (KUAS) (Faculty of Computer Sciences)", period: "2024 – 2029" },
        { name: "Martin Luther University Halle-Wittenberg (Faculty of Mathematics and Natural Sciences)", period: "2023 – 2028" },
        { name: "Technische Universität Dresden", period: "2023 – 2028" }, { name: "The Osnabrück University (Faculty of Mathematics and Natural Sciences)", period: "2022 – 2025" },
        { name: "TU Darmstadt", period: "2020 – 2025" }, { name: "University Passau (University Level)", period: "2024 – 2029" },
        { name: "University Passau (Faculty of Social and Political Sciences)", period: "2025 – 2030" },
        { name: "Ludwig-Maximilians-Universität München (Faculty of Social and Political Sciences)", period: "2025 – 2030" },
        { name: "University of Duisburg-Essen (Faculty of Engineering)", period: "2025 – 2030" }
      ]
    },
    { country: "India", code: "in", universities: [{ name: "Jindal Global University (Faculty of Social and Political Sciences)", period: "2024 – 2030" }] },
    {
      country: "Italy", code: "it", universities: [
        { name: "Ca' Foscari University of Venice", period: "2025 – 2030" }, { name: "University of Bologna", period: "2024 – 2029" },
        { name: "University of Naples L'Orientale (Università degli Studi di Napoli)", period: "2021 – 2026" }
      ]
    },
    {
      country: "Japan", code: "jp", universities: [
        { name: "Aichi Shukutoku University", period: "2024 – 2029" }, { name: "Akita International University", period: "2016 – Autorenew" },
        { name: "Asia University", period: "2024 – 2029" }, { name: "Chiba University", period: "2023 – 2028" },
        { name: "Chuo University", period: "2021 – 2026" }, { name: "Fujita Health University (Faculty of Medicine)", period: "2022 – 2027" },
        { name: "Hitotsubashi University (Faculty of Economics and Business)", period: "2021 – 2026" }, { name: "Kagoshima University", period: "2021 – 2026" },
        { name: "Kanazawa University", period: "2023 – 2028" }, { name: "Keio University", period: "2021 – 2026" },
        { name: "Kumamoto University", period: "2021 – 2026" }, { name: "Kwansei Gakuin University", period: "2024 – 2029" },
        { name: "Kyoto University", period: "2025 – 2030" }, { name: "Kyushu University", period: "2024 – 2029" },
        { name: "Meiji University (Faculty of Social and Political Sciences)", period: "2021 – 2026" }, { name: "Nagaoka University of Technology (Faculty of Engineering)", period: "2020 – 2025" },
        { name: "Nagasaki University", period: "2021 – 2026" }, { name: "Nagoya University", period: "2024 – 2029" },
        { name: "Nanzan University", period: "2024 – 2029" }, { name: "Nara Institute of Science and Technology (NAIST)", period: "2022 – 2027" },
        { name: "Nara Women's University", period: "2024 – 2029" }, { name: "Ochanomizu University", period: "2021 – 2026" },
        { name: "Okayama University", period: "2021 – 2026" }, { name: "Osaka Metropolitan University", period: "2024 – 2029" },
        { name: "Osaka University", period: "2025 – 2030" }, { name: "Ritsumeikan University", period: "2022 – 2027" },
        { name: "Ryukoku University", period: "2021 – 2026" }, { name: "Saitama University (Faculty of Economics and Business)", period: "2020 – 2025" },
        { name: "Saitama University (University Level)", period: "2025 – 2030" }, { name: "Shizuoka University (University Level)", period: "2020 – 2025" },
        { name: "Shizuoka University (Faculty of Economics and Business)", period: "2020 – 2025" }, { name: "Soka University", period: "2023 – 2028" },
        { name: "Sophia University", period: "2021 – 2026" }, { name: "Tohoku University", period: "2024 – 2029" },
        { name: "Tokyo Institute of Technology (Tokyo Tech)", period: "2019 – 2024" }, { name: "Tokyo University of Agriculture and Technology", period: "2022 – 2027" },
        { name: "Tokyo University of Foreign Studies", period: "2024 – 2029" }, { name: "University of Fukui", period: "2023 – 2028" },
        { name: "University of Hokkaido (Graduate School of Environmental Studies)", period: "2020 – 2025" }, { name: "University of Tokyo", period: "2024 – 2029" },
        { name: "Waseda University", period: "2017 – Autorenew" }, { name: "Yamaguchi University", period: "2020 – 2025" },
        { name: "Yamanashi Prefectural University", period: "2022 – 2027" }, { name: "Institute of Science Tokyo", period: "2025 – 2030" },
        { name: "Tokyo Metropolitan University (Vocational Programs)", period: "2024 – 2029" }
      ]
    },
    { country: "Kazakhstan", code: "kz", universities: [{ name: "Al-Farabi Kazakh National University", period: "2021 – 2026" }] },
    { country: "Lithuania", code: "lt", universities: [{ name: "Mykolas Romeris University", period: "2024 – 2029" }] },
    {
      country: "Malaysia", code: "my", universities: [
        { name: "Mahsa University (Faculty of Public Health)", period: "2020 – 2025" }, { name: "Taylor's University", period: "2022 – 2027" },
        { name: "Universiti Malaya (Faculty of Medicine)", period: "2021 – 2026" }, { name: "Universiti Malaya (Faculty of Social and Political Sciences)", period: "2022 – 2027" },
        { name: "Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)", period: "2024 – 2029" }, { name: "Universiti Teknologi MARA (UiTM) (Faculty of Law)", period: "2025 – 2028" },
        { name: "Universiti Teknologi Petronas (Faculty of Engineering)", period: "2025 – 2030" }
      ]
    },
    { country: "Mexico", code: "mx", universities: [{ name: "Universidad ITES De Monterrey", period: "2021 – 2026" }, { name: "Universidad Popular Autonoma - UPAEP", period: "2026 – 2031" }] },
    {
      country: "Netherlands", code: "nl", universities: [
        { name: "Eindhoven University of Technology (Faculty of Engineering)", period: "2023 – 2028" }, { name: "Erasmus University of Rotterdam", period: "2026 – 2031" },
        { name: "HAN University of Applied Science", period: "2026 – 2031" }, { name: "Leiden University (Faculty of Law)", period: "2023 – 2028" },
        { name: "Leiden University Medical Center (LUMC) (Faculty of Medicine)", period: "2023 – 2028" }, { name: "Radboud University Nijmegen", period: "2021 – 2026" },
        { name: "Tilburg University", period: "2022 – 2027" }, { name: "Vrije Universiteit (University Level)", period: "2021 – 2026" },
        { name: "Vrije Universiteit (Faculty of Pharmacy)", period: "2022 – 2027" }, { name: "University of Groningen (Faculty of Law)", period: "2023 – 2028" },
        { name: "Utrecht University (Faculty of Law)", period: "2024 – 2029" }
      ]
    },
    { country: "New Zealand", code: "nz", universities: [{ name: "University of Otago", period: "2025 – 2030" }] },
    { country: "Norway", code: "no", universities: [{ name: "Oslo Metropolitan University (Faculty of Engineering)", period: "2023 – 2028" }] },
    {
      country: "People's Republic of China", code: "cn", universities: [
        { name: "China University of Geosciences", period: "2022 – 2027" }, { name: "Chinese University of Hong Kong", period: "2026 – 2031" },
        { name: "Chinese University of Hong Kong (CUHK) Shenzhen", period: "2026 – 2031" }, { name: "City University of Hong Kong (CityUHK)", period: "2026 – 2031" },
        { name: "Hainan University", period: "2024 – 2029" }, { name: "Hong Kong University of Science and Technology", period: "2025 – 2030" },
        { name: "Tianjin University", period: "2024 – 2029" }, { name: "Tsinghua University (Faculty of Law)", period: "2025 – 2030" },
        { name: "Xiamen University", period: "2023 – 2028" }, { name: "Xi'an Jiaotong-Liverpool University", period: "2025 – 2030" },
        { name: "Yunnan University", period: "2023 – 2028" }, { name: "Jiangxi University of Finance and Economics (Graduate School of Sustainable Development)", period: "2022 – 2028" },
        { name: "Peking University", period: "2025 – 2030" }, { name: "Tongji University", period: "2025 – 2030" }
      ]
    },
    {
      country: "Philippines", code: "ph", universities: [
        { name: "University of Cebu (Faculty of Law)", period: "2021 – 2026" }, { name: "University of San Agustin (Faculty of Pharmacy)", period: "2021 – 2026" },
        { name: "University of the Philippines", period: "2025 – 2030" }
      ]
    },
    { country: "Portugal", code: "pt", universities: [{ name: "Universidade do Minho", period: "2023 – 2026" }] },
    { country: "Republic of Ireland", code: "ie", universities: [{ name: "University of College Cork", period: "2021 – 2026" }] },
    { country: "Republic of Poland", code: "pl", universities: [{ name: "Kozminski University", period: "2025 – 2028" }, { name: "SWPS University", period: "2025 – 2030" }] },
    {
      country: "Republic of Korea", code: "kr", universities: [
        { name: "Ajou University", period: "2022 – 2027" }, { name: "Busan University of Foreign Studies", period: "2021 – 2026" },
        { name: "Chonnam National University", period: "2021 – 2026" }, { name: "Chung-Ang University", period: "2026 – 2031" },
        { name: "Daegu University", period: "2022 – 2027" }, { name: "Dong A University", period: "2024 – 2029" },
        { name: "Dong-Eui University", period: "2021 – 2026" }, { name: "Dongguk University", period: "2023 – 2028" },
        { name: "Duksung Women's University", period: "2023 – 2028" }, { name: "Hankuk University of Foreign Studies", period: "2024 – 2029" },
        { name: "Hanyang University", period: "2021 – 2026" }, { name: "Inha University", period: "2024 – 2029" },
        { name: "Inje University (Faculty of Public Health)", period: "2022 – 2027" }, { name: "Jeonbuk National University", period: "2023 – 2028" },
        { name: "Kangwon National University", period: "2024 – 2029" }, { name: "Keimyung University", period: "2024 – 2029" },
        { name: "Kookmin University", period: "2012 – (Auto-renew)" }, { name: "Korea University (University Level)", period: "2024 – 2029" },
        { name: "Korea University (Faculty of Social and Political Sciences)", period: "2023 – 2028" }, { name: "Korea Advanced Institute of Science and Technology (KAIST) (Faculty of Engineering)", period: "2024 – 2029" },
        { name: "Kumoh National Institute of Technology", period: "2024 – 2029" }, { name: "Kyung Hee University", period: "2024 – 2029" },
        { name: "Kyungpook National University", period: "2021 – 2026" }, { name: "Pohang University of Science and Technology (POSTECH)", period: "2024 – 2029" },
        { name: "Pukyong National University (University Level)", period: "2021 – 2026" }, { name: "Pukyong National University (Faculty of Social and Political Sciences)", period: "2023 – 2028" },
        { name: "Pusan National University", period: "2024 – 2029" }, { name: "Sejong University", period: "2024 – 2029" },
        { name: "Seoul National University (SNU)", period: "2022 – 2027" }, { name: "Seoul National University of Science and Technology (SeoulTech)", period: "2021 – 2026" },
        { name: "Sungshin Women's University", period: "2024 – 2029" }, { name: "Sungkyunkwan University (Faculty of Administration Sciences)", period: "2025 – 2030" },
        { name: "University of Seoul", period: "2022 – 2027" }, { name: "University of Ulsan", period: "2022 – 2027" },
        { name: "Woosong University", period: "2024 – 2029" }, { name: "Yeungnam University (Faculty of Engineering)", period: "2024 – 2029" },
        { name: "Yonsei University (University Level)", period: "2010 – (Auto-renew)" }, { name: "Yonsei University (Faculty of Social and Political Sciences)", period: "2024 – 2029" }
      ]
    },
    {
      country: "Republic of Turkey", code: "tr", universities: [
        { name: "Abdullah Gul University", period: "2024 – 2029" }, { name: "Altinbas University", period: "2023 – 2028" },
        { name: "Bogazici University", period: "2027 – 2031" }, { name: "Bolu Abant Izzet Baysal University", period: "2025 – 2027" },
        { name: "Cukurova University", period: "2024 – 2029" }, { name: "Sabanci University", period: "2017 – 2027" },
        { name: "Sivas Cumhuriyet Üniversitesi", period: "2023 – 2027" }
      ]
    },
    {
      country: "Romania", code: "ro", universities: [
        { name: "Alexandru Ioan Cuza University of Iasi", period: "2025 – 2027" }, { name: "Transilvania University of Brasov", period: "2021 – 2027" },
        { name: "West University of Timisoara", period: "2025 – 2029" }
      ]
    },
    {
      country: "Russia", code: "ru", universities: [
        { name: "Institute of Asia & Africa Studies (IAAS), Lomonosov Moscow State University (Faculty of Humanities)", period: "2021 – 2026" },
        { name: "National Research University HSE", period: "2023 – 2028" }, { name: "Peter the Great St. Petersburg Polytechnic University (Faculty of Engineering)", period: "2021 – 2026" },
        { name: "Saint-Petersburg University", period: "2025 – 2030" }
      ]
    },
    { country: "Singapore", code: "sg", universities: [{ name: "National University of Singapore (Faculty of Economics and Business)", period: "2022 – 2027" }] },
    { country: "Spain", code: "es", universities: [{ name: "Public University of Navarre (Faculty of Humanities)", period: "2023 – 2027" }, { name: "Universidad Politecnica de Madrid", period: "2024 – 2025" }] },
    { country: "Sweden", code: "se", universities: [{ name: "Linnaeus University", period: "2024 – 2029" }, { name: "Sahlgrenska University (Faculty of Medicine)", period: "2022 – 2027" }] },
    { country: "Switzerland", code: "ch", universities: [{ name: "University of Bern (Directorate for Internationalization of Education)", period: "2025 – 2030" }] },
    {
      country: "Taiwan", code: "tw", universities: [
        { name: "Feng Chia University", period: "2022 – 2027" }, { name: "National Changhua University of Education", period: "2022 – 2027" },
        { name: "National Chengchi University", period: "2021 – 2026" }, { name: "National Chung Hsing University", period: "2022 – 2027" },
        { name: "National Dong Hwa University", period: "2022 – 2027" }, { name: "National Formosa University", period: "2024 – 2029" },
        { name: "National Quemoy University", period: "2022 – 2027" }, { name: "National Sun Yat-sen University", period: "2024 – 2029" },
        { name: "National Taipei University", period: "2024 – 2029" }, { name: "National Taiwan Normal University", period: "2017 – Auto-renew" },
        { name: "National Tsinghua University", period: "2025 – 2030" }, { name: "National Yang Ming Chiao Tung University (Faculty of Engineering)", period: "2024 – 2029" },
        { name: "National Yunlin University of Science and Technology (YUNTECH)", period: "2021 – 2026" }
      ]
    },
    {
      country: "Thailand", code: "th", universities: [
        { name: "Mae Fah Luang University", period: "2022 – 2027" }, { name: "Thammasat University (SIIT) (Faculty of Engineering)", period: "2021 – 2026" },
        { name: "Mahidol University (Faculty of Social and Political Sciences)", period: "2025 – 2028" }
      ]
    },
    {
      country: "United Kingdom", code: "gb", universities: [
        { name: "University College London (Faculty of Administrative Sciences)", period: "2023 – 2026" }, { name: "University of Birmingham", period: "2023 – 2028" },
        { name: "University of Warwick", period: "2026 – 2031" }
      ]
    },
    {
      country: "United States", code: "us", universities: [
        { name: "Dominican University (Faculty of Social and Political Sciences)", period: "2020 – 2025" }, { name: "Michigan State University (Faculty of Economics and Business)", period: "2024 – 2029" }
      ]
    }
  ];

  const partnerBtn = document.getElementById('partner-univ-btn');
  const partnerModal = document.getElementById('partner-modal');
  const partnerCloseBtn = document.getElementById('partner-modal-close');
  const partnerSearchInput = document.getElementById('partner-search-input');
  const partnerContent = document.getElementById('partner-modal-content');

  const renderPartnerData = (filterText = '') => {
    partnerContent.innerHTML = '';
    const lowerFilter = filterText.toLowerCase();

    partnerUniversitiesData.forEach(countryItem => {
      const countryMatches = countryItem.country.toLowerCase().includes(lowerFilter);
      const matchingUnivs = countryItem.universities.filter(univ =>
        univ.name.toLowerCase().includes(lowerFilter)
      );

      if (!countryMatches && matchingUnivs.length === 0) return;

      const univsToRender = countryMatches && filterText ? countryItem.universities : (filterText ? matchingUnivs : countryItem.universities);

      const card = document.createElement('div');
      card.className = 'country-card animate-up';

      let html = `
          <div class="country-header">
            <img src="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${countryItem.code}.svg" alt="${countryItem.country} flag" class="country-flag" loading="lazy">
            <h3>${countryItem.country}</h3>
          </div>
          <ul class="country-univ-list">
        `;

      univsToRender.forEach(univ => {
        html += `
            <li class="country-univ-item">
              <span class="univ-name">${univ.name}</span>
              <span class="univ-period"><span class="material-symbols-outlined">schedule</span> Validity: ${univ.period}</span>
            </li>
          `;
      });

      html += `</ul>`;
      card.innerHTML = html;
      partnerContent.appendChild(card);
    });
  };

  if (partnerBtn && partnerModal && partnerCloseBtn) {
    partnerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      partnerSearchInput.value = '';
      renderPartnerData();
      partnerModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const closePartnerModal = () => {
      partnerModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    partnerCloseBtn.addEventListener('click', closePartnerModal);

    partnerModal.addEventListener('click', (e) => {
      if (e.target === partnerModal) closePartnerModal();
    });

    partnerSearchInput.addEventListener('input', (e) => {
      renderPartnerData(e.target.value);
    });
  }

  // ── Asistensi Logic ──────────────────────────────────────────
  const asistensiVideoBtn = document.getElementById('asistensi-video-btn');
  const asistensiNotesBtn = document.getElementById('asistensi-notes-btn');
  const asistensiModal = document.getElementById('asistensi-modal');
  const asistensiModalTitle = document.getElementById('asistensi-modal-title');
  const asistensiModalContent = document.getElementById('asistensi-modal-content');
  const asistensiModalClose = document.getElementById('asistensi-modal-close');

  const asistensiData = {
    video: [
      { title: 'Calculus', url: 'https://drive.google.com/file/d/1L561ADk2zekScKnvWnm5osRADcl9y0fI/view?usp=drive_link' },
      { title: 'Linear Algebra', url: 'https://drive.google.com/file/d/1dfGr5ocYnA9CAQE0iSvuWZqaBOdfib1d/view?usp=drive_link' },
      { title: 'Physics Electricity', url: 'https://drive.google.com/file/d/1wj2q1rDggQKlt0nYSWVgi236OBQ_w7bU/view?usp=drive_link' },
      { title: 'Physics Mechanics', url: 'https://drive.google.com/file/d/1vDxO1ovHpbeD9ZLwXfkgoN21sRTQ4BD3/view?usp=drive_link' }
    ],
    notes: [
      { title: 'Calculus', url: 'https://drive.google.com/drive/folders/1JiD5FfVg99Sl2f1X-SFmvBQuNBEb4ovr' },
      { title: 'Linear Algebra', url: 'https://drive.google.com/file/d/1E3D_esW-TDAs-PzvltSlTk8i0HWHtbN-/view?usp=drive_link' },
      { title: 'Physics Electricity', url: 'https://drive.google.com/file/d/1mKNeyqx_gQoaoze9E2ZxGf3F72FbSiCu/view?usp=drive_link' },
      { title: 'Physics Mechanics', url: 'https://drive.google.com/drive/folders/1pVk3O0bU9A7HyUz_olUBOFeXXWfLaJh4' }
    ]
  };

  function openAsistensiModal(type) {
    asistensiModalTitle.textContent = type === 'video' ? 'Video' : 'Notes';
    asistensiModalContent.innerHTML = '';

    asistensiData[type].forEach(item => {
      const linkCard = document.createElement('a');
      linkCard.href = item.url;
      linkCard.target = '_blank';
      linkCard.className = 'uni-card';
      linkCard.style.textDecoration = 'none';
      linkCard.style.color = 'inherit';

      const iconName = type === 'video' ? 'play_circle' : 'menu_book';

      linkCard.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 40px; color: var(--cerulean-blue);">${iconName}</span>
        <div class="uni-info" style="display: flex; align-items: center;">
          <h4 class="uni-name" style="margin: 0; font-size: 20px;">${item.title}</h4>
        </div>
      `;
      asistensiModalContent.appendChild(linkCard);
    });

    asistensiModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  const closeAsistensiModal = () => {
    asistensiModal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  if (asistensiVideoBtn && asistensiNotesBtn && asistensiModal) {
    asistensiVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAsistensiModal('video');
    });

    asistensiNotesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAsistensiModal('notes');
    });

    if (asistensiModalClose) {
      asistensiModalClose.addEventListener('click', closeAsistensiModal);
    }

    asistensiModal.addEventListener('click', (e) => {
      if (e.target === asistensiModal) closeAsistensiModal();
    });
  }

  // ── Dynamic Sticky Headers Logic ───────────────────────────────
  let lastScrollY = window.scrollY;
  const dynamicHeaders = document.querySelectorAll('.dynamic-header');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 150) {
      dynamicHeaders.forEach(header => header.classList.add('scrolled-style'));
    } else {
      dynamicHeaders.forEach(header => header.classList.remove('scrolled-style'));
    }

    if (currentScrollY > lastScrollY && currentScrollY > 150) {
      // Scrolling down
      dynamicHeaders.forEach(header => header.classList.add('hide-header'));
    } else {
      // Scrolling up
      dynamicHeaders.forEach(header => header.classList.remove('hide-header'));
    }

    lastScrollY = currentScrollY;
  });

  // ── Mobile Menu Toggle Logic ─────────────────────────────────
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const headerTabs = document.getElementById('header__tabs');

  if (mobileMenuBtn && headerTabs) {
    mobileMenuBtn.addEventListener('click', () => {
      headerTabs.classList.toggle('menu-open');
      if (headerTabs.classList.contains('menu-open')) {
        mobileMenuBtn.textContent = 'close';
      } else {
        mobileMenuBtn.textContent = 'menu';
      }
    });

    // Close menu when a tab is clicked
    const tabBtns = headerTabs.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        headerTabs.classList.remove('menu-open');
        mobileMenuBtn.textContent = 'menu';
      });
    });
  }

});
