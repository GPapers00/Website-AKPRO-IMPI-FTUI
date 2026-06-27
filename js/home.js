// js/home.js
import { supabase } from './supabase.js';

export function initHome() {
  // ── Calendar Modal Logic ──────────────────────────────────────────
  const calendarModalBtn = document.getElementById('calendar-modal-btn');
  const calendarModal = document.getElementById('calendar-modal');
  const calendarModalClose = document.getElementById('calendar-modal-close');

  if (calendarModalBtn && calendarModal && calendarModalClose) {
    calendarModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calendarModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      loadAcademicCalendar('current');
    });

    const closeCalendarModal = () => {
      calendarModal.classList.add('hidden');
      document.body.style.overflow = '';
    };
    calendarModalClose.addEventListener('click', closeCalendarModal);
    calendarModal.addEventListener('click', (e) => { if (e.target === calendarModal) closeCalendarModal(); });
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
      loadAcademicCalendar('past');
    });

    const closePastCalendarModal = () => {
      pastCalendarModal.classList.add('hidden');
      document.body.style.overflow = '';
    };
    pastCalendarModalClose.addEventListener('click', closePastCalendarModal);
    pastCalendarModal.addEventListener('click', (e) => { if (e.target === pastCalendarModal) closePastCalendarModal(); });
  }

  // ── Academic Calendar Fetch Logic ───────────────────────────────────
  const calendarModalContent = document.getElementById('calendar-modal-content');
  const pastCalendarModalContent = document.getElementById('past-calendar-modal-content');

  async function loadAcademicCalendar(modalType) {
    if (!supabase || (!calendarModalContent && !pastCalendarModalContent)) return;
    
    if (modalType === 'current' && calendarModalContent && !calendarModalContent.innerHTML.includes('img')) {
      calendarModalContent.innerHTML = '<div class="skeleton-loader" style="height: 300px;"></div>';
    } else if (modalType === 'past' && pastCalendarModalContent && !pastCalendarModalContent.innerHTML.includes('uni-card')) {
      pastCalendarModalContent.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
    }

    try {
      const cachedData = sessionStorage.getItem('academicCalendarData');
      let data = [];
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        const response = await supabase.from('academic_calendar').select('*').order('id', { ascending: true });
        if (response.error) throw response.error;
        data = response.data;
        if (data && data.length > 0) {
          sessionStorage.setItem('academicCalendarData', JSON.stringify(data));
        }
      }

      if (data && data.length > 0) {
        let currentHtml = '';
        let pastHtml = '';

        data.forEach(item => {
          if (item.type === 'current_image') {
            currentHtml += `<img src="${item.url}" alt="${item.title}" style="width: 100%; height: auto; border-radius: 8px;" loading="lazy">`;
          } else if (item.type === 'current_link') {
            currentHtml += `<a href="${item.url}" target="_blank" class="appointment-btn" style="text-align: center; display: inline-block; margin-top: 16px; text-decoration: none; border-radius: 9999px;">${item.title}</a>`;
          } else if (item.type === 'past_link') {
            pastHtml += `<a href="${item.url}" target="_blank" class="uni-card" style="text-decoration: none; color: inherit; display: flex; align-items: center; padding: 16px; background: rgba(255, 255, 255, 0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 15px rgba(0,0,0,0.05); backdrop-filter: blur(10px); transition: all 0.3s ease;"><span class="material-symbols-outlined" style="font-size: 40px; color: var(--cerulean-blue); margin-right: 16px;">calendar_month</span><div class="uni-info"><h4 class="uni-name" style="margin: 0; font-size: 20px;">${item.title}</h4></div></a>`;
          }
        });

        if (calendarModalContent) calendarModalContent.innerHTML = currentHtml;
        if (pastCalendarModalContent) pastCalendarModalContent.innerHTML = pastHtml;
      }
    } catch (error) {
      console.error("Error fetching academic calendar:", error);
      if (modalType === 'current' && calendarModalContent) calendarModalContent.innerHTML = '<p style="text-align:center;">Error loading data.</p>';
      if (modalType === 'past' && pastCalendarModalContent) pastCalendarModalContent.innerHTML = '<p style="text-align:center;">Error loading data.</p>';
    }
  }


  // ── Open Opportunities Logic ──────────────────────────────────
  let openingsData = [];
  const openingsBtn = document.getElementById('openings-modal-btn');
  const openingsModal = document.getElementById('openings-modal');
  const openingsCloseBtn = document.getElementById('openings-modal-close');
  const openingsSearchInput = document.getElementById('openings-search-input');
  const openingsCountryFilter = document.getElementById('openings-country-filter');
  const openingsStatusFilter = document.getElementById('openings-status-filter');
  const openingsContent = document.getElementById('openings-modal-content');

  async function loadOpenings() {
    if (!supabase) return;
    
    if (openingsContent && openingsData.length === 0) {
      openingsContent.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
    }

    try {
      sessionStorage.removeItem('openingsData'); // Force clear cache so new scraper data shows up
      const cachedData = sessionStorage.getItem('openingsData');
      if (cachedData) {
        openingsData = JSON.parse(cachedData);
      } else {
        const { data, error } = await supabase.from('open_opportunities').select('*').order('id', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          openingsData = data;
          sessionStorage.setItem('openingsData', JSON.stringify(data));
        }
      }

      if (openingsData.length > 0) {
        if (openingsCountryFilter && openingsStatusFilter && openingsCountryFilter.options.length <= 1) {
          const countries = [...new Set(openingsData.map(item => item.country))].filter(Boolean).sort();
          const statuses = [...new Set(openingsData.map(item => item.status))].filter(Boolean).sort();
          countries.forEach(country => { const option = document.createElement('option'); option.value = country; option.textContent = country; openingsCountryFilter.appendChild(option); });
          statuses.forEach(status => { const option = document.createElement('option'); option.value = status; option.textContent = status; openingsStatusFilter.appendChild(option); });
        }
        renderOpeningsData();
      }
    } catch (error) {
      console.error("Error fetching open opportunities:", error);
      if (openingsContent) openingsContent.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h4>Error loading data.</h4></div>';
    }
  }

  const renderOpeningsData = () => {
    if (!openingsContent) return;
    const filterText = openingsSearchInput.value.toLowerCase();
    const selectedCountry = openingsCountryFilter ? openingsCountryFilter.value : '';
    const selectedStatus = openingsStatusFilter ? openingsStatusFilter.value : '';
    
    openingsContent.innerHTML = '';
    
    const filteredData = openingsData.filter(item => {
      const matchesSearch = item.university.toLowerCase().includes(filterText) || 
                            item.country.toLowerCase().includes(filterText) ||
                            item.program_name.toLowerCase().includes(filterText);
      const matchesCountry = selectedCountry === '' || item.country === selectedCountry;
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
      
      return matchesSearch && matchesCountry && matchesStatus;
    });

    if (filteredData.length === 0) {
      openingsContent.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h4 style="font-size: 20px; color: var(--bear-brown);">No opportunities found.</h4></div>';
      return;
    }

    const groupedByCountry = {};
    filteredData.forEach(item => {
      if (!groupedByCountry[item.country]) {
        groupedByCountry[item.country] = [];
      }
      groupedByCountry[item.country].push(item);
    });

    const sortedCountries = Object.keys(groupedByCountry).sort();
    const getCountryCode = (countryName) => {
      const map = {
        'japan': 'jp', 'south korea': 'kr', 'korea': 'kr', 'taiwan': 'tw',
        'singapore': 'sg', 'malaysia': 'my', 'indonesia': 'id', 'thailand': 'th',
        'philippines': 'ph', 'vietnam': 'vn', 'china': 'cn', 'hong kong': 'hk',
        'india': 'in', 'australia': 'au', 'new zealand': 'nz', 'united states': 'us',
        'usa': 'us', 'canada': 'ca', 'united kingdom': 'gb', 'uk': 'gb',
        'germany': 'de', 'france': 'fr', 'netherlands': 'nl', 'italy': 'it',
        'spain': 'es', 'sweden': 'se', 'switzerland': 'ch', 'norway': 'no',
        'denmark': 'dk', 'finland': 'fi', 'belgium': 'be', 'austria': 'at',
        'ireland': 'ie', 'brazil': 'br', 'mexico': 'mx', 'argentina': 'ar',
        'chile': 'cl', 'russia': 'ru', 'turkey': 'tr', 'saudi arabia': 'sa',
        'uae': 'ae', 'united arab emirates': 'ae', 'south africa': 'za', 'egypt': 'eg'
      };
      return map[countryName.toLowerCase().trim()] || '';
    };

    sortedCountries.forEach(country => {
      const countryGroup = document.createElement('div');
      countryGroup.className = 'opening-country-group animate-up';
      countryGroup.style.marginBottom = '24px';
      const cCode = getCountryCode(country);
      const flagHtml = cCode ? `<img src="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${cCode}.svg" alt="${country}" style="width:32px; height:auto; margin-right:12px; border-radius:4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">` : '';
      
      countryGroup.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom: 16px; border-bottom: 2px solid rgba(13, 110, 253, 0.2); padding-bottom: 8px;">
          ${flagHtml}
          <h3 style="margin:0; font-size: 24px; color: var(--bear-brown);">${country}</h3>
        </div>
        <div class="country-openings-grid"></div>
      `;

      const grid = countryGroup.querySelector('.country-openings-grid');

      groupedByCountry[country].forEach(item => {
        const card = document.createElement('div');
        card.className = 'opening-card';
                
        let html = `
          <div class="opening-header" style="margin-bottom: 12px;">
            <h4 class="opening-title" style="margin:0; font-size: 18px; color: var(--bear-brown);">${item.university}</h4>
          </div>
          <div class="opening-details" style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <div class="opening-detail-row" style="display: flex; align-items: flex-start; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px; color: var(--cerulean-blue); flex-shrink: 0;">badge</span><div><strong>Program:</strong> <span>${item.program_name}</span></div></div>
            <div class="opening-detail-row" style="display: flex; align-items: flex-start; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px; color: var(--cerulean-blue); flex-shrink: 0;">info</span><div><strong>Status:</strong> <span style="font-weight:bold; color: ${item.status === 'OPEN' ? 'var(--cerulean-blue)' : '#e67e22'};">${item.status}</span></div></div>
            <div class="opening-detail-row" style="display: flex; align-items: flex-start; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px; color: #cf2e2e; flex-shrink: 0;">event</span><div><strong>Deadline:</strong> <span style="color:#cf2e2e; font-weight:bold;">${item.deadline}</span></div></div>
            <div class="opening-detail-row" style="display: flex; align-items: flex-start; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px; color: var(--cerulean-blue); flex-shrink: 0;">schedule</span><div><strong>Period:</strong> <span>${item.period}</span></div></div>
            <div class="opening-detail-row" style="display: flex; align-items: flex-start; gap: 8px;"><span class="material-symbols-outlined" style="font-size: 18px; color: var(--cerulean-blue); flex-shrink: 0;">school</span><div><strong>Level:</strong> <span>${item.level}</span></div></div>
        `;
        
        let showNotes = false;
        if (item.notes && item.notes.trim() !== '') {
          const lowerNotes = item.notes.trim().toLowerCase();
          if (lowerNotes.includes('active ui student') && lowerNotes.length < 40) { showNotes = false; } else { showNotes = true; }
        }

        if (showNotes) {
          html += `<div class="opening-detail-row" style="background: rgba(230, 126, 34, 0.1); padding: 10px 12px; border-radius: 8px; border-left: 4px solid #e67e22; margin-top: 8px; display: flex; align-items: flex-start; gap: 8px;"><span class="material-symbols-outlined" style="color: #e67e22; font-size: 20px; flex-shrink: 0;">notification_important</span><div><strong style="color: #e67e22;">Important Notes:</strong> <span style="display: block; margin-top: 4px; color: var(--bear-brown); line-height: 1.4;">${item.notes}</span></div></div>`;
        }

        if (item.link && item.link.trim() !== '' && !item.link.includes('coming-soon')) {
          html += `<a href="${item.link}" target="_blank" class="opening-link" style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: var(--cerulean-blue); color: white; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 500; transition: background 0.3s;">View Details</a>`;
        } else {
          html += `<span class="opening-link" style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: var(--text-muted); color: white; border-radius: 6px; text-align: center; font-weight: 500; cursor:not-allowed;">Link Coming Soon</span>`;
        }
        html += `</div>`;
        card.innerHTML = html;
        grid.appendChild(card);
      });
      openingsContent.appendChild(countryGroup);
    });
  };

  if (openingsBtn && openingsModal && openingsCloseBtn) {
    openingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(openingsSearchInput) openingsSearchInput.value = '';
      if(openingsCountryFilter) openingsCountryFilter.value = '';
      if(openingsStatusFilter) openingsStatusFilter.value = '';
      
      openingsModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      loadOpenings();
    });

    const closeOpeningsModal = () => { openingsModal.classList.add('hidden'); document.body.style.overflow = ''; };
    openingsCloseBtn.addEventListener('click', closeOpeningsModal);
    openingsModal.addEventListener('click', (e) => { if (e.target === openingsModal) closeOpeningsModal(); });
    
    if (openingsSearchInput) openingsSearchInput.addEventListener('input', renderOpeningsData);
    if (openingsCountryFilter) openingsCountryFilter.addEventListener('change', renderOpeningsData);
    if (openingsStatusFilter) openingsStatusFilter.addEventListener('change', renderOpeningsData);
  }
}
