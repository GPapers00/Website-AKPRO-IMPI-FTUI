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
  let universitiesData = [];

  // Initialize Supabase
  const supabaseUrl = 'https://yuowevnqampepskwlgbd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b3dldm5xYW1wZXBza3dsZ2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzkyNTAsImV4cCI6MjA5NzcxNTI1MH0.MX2tsfgkPEazK-pdPeXfXi8vyfdmSZ5cIdRsmTlDKQs';
  const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

  async function loadUniversities() {
    if (!supabase) {
      console.error("Supabase library not loaded.");
      return;
    }

    try {
      // Fetch from the 'universities' table we created in SQL
      const { data, error } = await supabase.from('universities').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        universitiesData = data;
        console.log("Successfully loaded universities from Supabase:", data);
      } else {
        console.warn("Supabase returned empty data for universities.");
      }
    } catch (error) {
      console.error("Error fetching universities from Supabase:", error);
    }
  }

  // Load the data as soon as the DOM is ready
  loadUniversities();

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
                  <img src="${uni.logo}" alt="${uni.name} Logo" class="uni-logo" loading="lazy" onerror="this.src='assets/logo.png'">
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
  let partnerUniversitiesData = [];

  async function loadGlobalPartners() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('global_partners').select('*').order('country', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        partnerUniversitiesData = data;
        if (typeof populateCountryFilter === 'function') {
          populateCountryFilter();
        }
      }
    } catch (error) {
      console.error("Error fetching global partners:", error);
    }
  }

  loadGlobalPartners();

  const partnerBtn = document.getElementById('partner-univ-btn');
  const partnerModal = document.getElementById('partner-modal');
  const partnerCloseBtn = document.getElementById('partner-modal-close');
  const partnerSearchInput = document.getElementById('partner-search-input');
  const partnerCountryFilter = document.getElementById('partner-country-filter');
  const partnerContent = document.getElementById('partner-modal-content');

  // Populate Country Filter Dropdown
  const populateCountryFilter = () => {
    if (!partnerCountryFilter) return;
    partnerUniversitiesData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.country.toLowerCase();
      option.textContent = item.country;
      partnerCountryFilter.appendChild(option);
    });
  };
  populateCountryFilter();

  const renderPartnerData = () => {
    const filterText = partnerSearchInput.value;
    const selectedCountry = partnerCountryFilter ? partnerCountryFilter.value : '';

    partnerContent.innerHTML = '';
    const lowerFilter = filterText.toLowerCase();

    partnerUniversitiesData.forEach(countryItem => {
      // If a country is selected and this isn't it, skip entirely
      if (selectedCountry && countryItem.country.toLowerCase() !== selectedCountry) {
        return;
      }

      const matchingUnivs = countryItem.universities.filter(univ =>
        univ.name.toLowerCase().includes(lowerFilter)
      );

      // If searching text and no universities match in this country, skip
      if (filterText && matchingUnivs.length === 0) return;

      const univsToRender = filterText ? matchingUnivs : countryItem.universities;

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
      if (partnerCountryFilter) partnerCountryFilter.value = '';
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

    partnerSearchInput.addEventListener('input', () => {
      renderPartnerData();
    });

    if (partnerCountryFilter) {
      partnerCountryFilter.addEventListener('change', () => {
        renderPartnerData();
      });
    }
  }

  // ── Asistensi Logic ──────────────────────────────────────────
  const asistensiVideoBtn = document.getElementById('asistensi-video-btn');
  const asistensiNotesBtn = document.getElementById('asistensi-notes-btn');
  const asistensiModal = document.getElementById('asistensi-modal');
  const asistensiModalTitle = document.getElementById('asistensi-modal-title');
  const asistensiModalContent = document.getElementById('asistensi-modal-content');
  const asistensiModalClose = document.getElementById('asistensi-modal-close');

  let asistensiData = { video: [], notes: [] };

  async function loadAsistensi() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('asistensi').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        asistensiData.video = data.filter(item => item.type === 'video');
        asistensiData.notes = data.filter(item => item.type === 'notes');
      }
    } catch (error) {
      console.error("Error fetching asistensi:", error);
    }
  }

  loadAsistensi();

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
  const dynamicHeaders = document.querySelectorAll('.dynamic-header');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // The banner is roughly 500px tall. We fade out the header completely
    // once we scroll past 450px so it doesn't block the view when the banner is out of sight.
    if (currentScrollY > 450) {
      dynamicHeaders.forEach(header => header.classList.add('hide-header'));
    } else {
      dynamicHeaders.forEach(header => header.classList.remove('hide-header'));

      // Animate to a smaller sticky header as we scroll down the banner
      if (currentScrollY > 100) {
        dynamicHeaders.forEach(header => header.classList.add('scrolled-style'));
      } else {
        dynamicHeaders.forEach(header => header.classList.remove('scrolled-style'));
      }
    }
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

  // ── Calendar Modal Logic ──────────────────────────────────────────
  const calendarModalBtn = document.getElementById('calendar-modal-btn');
  const calendarModal = document.getElementById('calendar-modal');
  const calendarModalClose = document.getElementById('calendar-modal-close');

  if (calendarModalBtn && calendarModal && calendarModalClose) {
    calendarModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calendarModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const closeCalendarModal = () => {
      calendarModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    calendarModalClose.addEventListener('click', closeCalendarModal);

    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) closeCalendarModal();
    });
  }

  // ── Past Calendar Modal Logic ──────────────────────────────────────────
  const pastCalendarModalBtn = document.getElementById('past-calendar-modal-btn');
  const pastCalendarModal = document.getElementById('past-calendar-modal');
  const pastCalendarModalClose = document.getElementById('past-calendar-modal-close');

  if (pastCalendarModalBtn && pastCalendarModal && pastCalendarModalClose) {
    pastCalendarModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pastCalendarModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const closePastCalendarModal = () => {
      pastCalendarModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    pastCalendarModalClose.addEventListener('click', closePastCalendarModal);

    pastCalendarModal.addEventListener('click', (e) => {
      if (e.target === pastCalendarModal) closePastCalendarModal();
    });
  }

  // ── Diktat Logic ──────────────────────────────────────────────
  const diktatContainer = document.getElementById('diktat-content-area');
  async function loadDiktat() {
    if (!supabase || !diktatContainer) return;
    try {
      const { data, error } = await supabase.from('diktat').select('*').order('id', { ascending: true });
      if (error) throw error;
      
      if (data && data.length > 0) {
        const topItems = data.filter(d => d.row_group === 'top');
        const bottomItems = data.filter(d => d.row_group === 'bottom');

        let html = '<div class="diktat-top-row">';
        topItems.forEach((item, index) => {
          html += `
            <a href="${item.url}" target="_blank"
              class="main-info-card glass-card animate-up delay-${index + 1}"
              style="display: block; text-decoration: none; color: inherit; width: 100%;">
              <h3>${item.title}</h3>
              <div class="image-link-wrapper" style="margin-bottom: 0;">
                <img src="${item.image_url}" alt="${item.title}" class="landscape-image top-focus" loading="lazy">
              </div>
            </a>
          `;
        });
        html += '</div><div class="diktat-bottom-row">';
        
        bottomItems.forEach((item, index) => {
          html += `
            <a href="${item.url}" target="_blank"
              class="main-info-card glass-card animate-up delay-${topItems.length + index + 1}"
              style="display: block; text-decoration: none; color: inherit; width: 100%;">
              <h3>${item.title}</h3>
              <div class="image-link-wrapper" style="margin-bottom: 0;">
                <img src="${item.image_url}" alt="${item.title}" class="landscape-image top-focus" loading="lazy">
              </div>
            </a>
          `;
        });
        html += '</div>';
        
        diktatContainer.innerHTML = html;
      }
    } catch (error) {
      console.error("Error fetching diktat:", error);
    }
  }
  loadDiktat();
  // ── Syllabus Mapping Logic ────────────────────────────────────
  const syllabiContainer = document.getElementById('syllabi-content-area');
  async function loadSyllabusMapping() {
    if (!supabase || !syllabiContainer) return;
    try {
      const { data, error } = await supabase.from('syllabus_mapping').select('*').order('id', { ascending: true });
      if (error) throw error;
      
      if (data && data.length > 0) {
        let html = '';
        data.forEach((item) => {
          if (item.status === 'unavailable') {
            html += `
              <div class="syllabi-circle-card unavailable" onclick="alert('The syllabus mapping for ${item.name} is currently unavailable.')">
                <div class="circle-logo"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div>
                <p>${item.name}<br><span class="unavailable-text">(Unavailable)</span></p>
              </div>
            `;
          } else if (item.status === 'coming_soon') {
            html += `
              <div class="syllabi-circle-card unavailable" onclick="alert('The syllabus mapping for ${item.name} is Coming Soon.')">
                <div class="circle-logo"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div>
                <p>${item.name}<br><span class="unavailable-text">(Coming Soon)</span></p>
              </div>
            `;
          } else {
            html += `
              <a href="${item.url}" target="_blank" class="syllabi-circle-card">
                <div class="circle-logo"><img src="${item.image_url}" alt="${item.name}" loading="lazy"></div>
                <p>${item.name}</p>
              </a>
            `;
          }
        });
        syllabiContainer.innerHTML = html;
      }
    } catch (error) {
      console.error("Error fetching syllabus mapping:", error);
    }
  }
  loadSyllabusMapping();
  // ── Academic Calendar Logic ───────────────────────────────────
  const calendarModalContent = document.getElementById('calendar-modal-content');
  const pastCalendarModalContent = document.getElementById('past-calendar-modal-content');

  async function loadAcademicCalendar() {
    if (!supabase || (!calendarModalContent && !pastCalendarModalContent)) return;
    try {
      const { data, error } = await supabase.from('academic_calendar').select('*').order('id', { ascending: true });
      if (error) throw error;

      if (data && data.length > 0) {
        let currentHtml = '';
        let pastHtml = '';

        data.forEach(item => {
          if (item.type === 'current_image') {
            currentHtml += `<img src="${item.url}" alt="${item.title}" style="width: 100%; height: auto; border-radius: 8px;" loading="lazy">`;
          } else if (item.type === 'current_link') {
            currentHtml += `
              <a href="${item.url}" target="_blank" class="appointment-btn" style="text-align: center; display: inline-block; margin-top: 16px; text-decoration: none; border-radius: 9999px;">
                ${item.title}
              </a>
            `;
          } else if (item.type === 'past_link') {
            pastHtml += `
              <a href="${item.url}" target="_blank" class="uni-card" style="text-decoration: none; color: inherit; display: flex; align-items: center; padding: 16px; background: rgba(255, 255, 255, 0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 15px rgba(0,0,0,0.05); backdrop-filter: blur(10px); transition: all 0.3s ease;">
                <span class="material-symbols-outlined" style="font-size: 40px; color: var(--cerulean-blue); margin-right: 16px;">calendar_month</span>
                <div class="uni-info">
                  <h4 class="uni-name" style="margin: 0; font-size: 20px;">${item.title}</h4>
                </div>
              </a>
            `;
          }
        });

        if (calendarModalContent) calendarModalContent.innerHTML = currentHtml;
        if (pastCalendarModalContent) pastCalendarModalContent.innerHTML = pastHtml;
      }
    } catch (error) {
      console.error("Error fetching academic calendar:", error);
    }
  }
  loadAcademicCalendar();

  // ── Open Opportunities Logic ──────────────────────────────────
  let openingsData = [];

  async function loadOpenings() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('open_opportunities').select('*').order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        openingsData = data;
      }
    } catch (error) {
      console.error("Error fetching open opportunities:", error);
    }
  }

  loadOpenings();

  const openingsBtn = document.getElementById('openings-modal-btn');
  const openingsModal = document.getElementById('openings-modal');
  const openingsCloseBtn = document.getElementById('openings-modal-close');
  const openingsSearchInput = document.getElementById('openings-search-input');
  const openingsContent = document.getElementById('openings-modal-content');

  const renderOpeningsData = () => {
    if (!openingsContent) return;
    const filterText = openingsSearchInput.value.toLowerCase();
    
    openingsContent.innerHTML = '';
    
    const filteredData = openingsData.filter(item => 
      item.university.toLowerCase().includes(filterText) || 
      item.country.toLowerCase().includes(filterText) ||
      item.program_name.toLowerCase().includes(filterText)
    );

    if (filteredData.length === 0) {
      openingsContent.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h4 style="font-size: 20px; color: var(--bear-brown);">No opportunities found.</h4></div>';
      return;
    }

    filteredData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'opening-card animate-up';
      
      let html = `
        <div class="opening-header">
          <h4 class="opening-title">\${item.university}</h4>
          <span class="opening-country">\${item.country}</span>
        </div>
        <div class="opening-details">
          <div class="opening-detail-row">
            <span class="material-symbols-outlined">badge</span>
            <strong>Program:</strong> <span>\${item.program_name}</span>
          </div>
          <div class="opening-detail-row">
            <span class="material-symbols-outlined">event</span>
            <strong>Deadline:</strong> <span style="color:#cf2e2e; font-weight:bold;">\${item.deadline}</span>
          </div>
          <div class="opening-detail-row">
            <span class="material-symbols-outlined">schedule</span>
            <strong>Period:</strong> <span>\${item.period}</span>
          </div>
          <div class="opening-detail-row">
            <span class="material-symbols-outlined">school</span>
            <strong>Level:</strong> <span>\${item.level}</span>
          </div>
      `;
      
      if (item.notes && item.notes.trim() !== '') {
        html += `
          <div class="opening-detail-row">
            <span class="material-symbols-outlined">info</span>
            <strong>Notes:</strong> <span>\${item.notes}</span>
          </div>
        `;
      }

      if (item.link && item.link.trim() !== '') {
        html += `<a href="\${item.link}" target="_blank" class="opening-link">View Details</a>`;
      }
      
      html += `</div>`;
      card.innerHTML = html;
      openingsContent.appendChild(card);
    });
  };

  if (openingsBtn && openingsModal && openingsCloseBtn) {
    openingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(openingsSearchInput) openingsSearchInput.value = '';
      renderOpeningsData();
      openingsModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    const closeOpeningsModal = () => {
      openingsModal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    openingsCloseBtn.addEventListener('click', closeOpeningsModal);

    openingsModal.addEventListener('click', (e) => {
      if (e.target === openingsModal) closeOpeningsModal();
    });

    if (openingsSearchInput) {
      openingsSearchInput.addEventListener('input', () => {
        renderOpeningsData();
      });
    }
  }

});
