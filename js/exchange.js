// js/exchange.js
import { supabase } from './supabase.js';

export function initExchange() {
  // ── University Modal Logic ──────────────────────────────────
  let universitiesData = [];

  async function loadUniversities() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('universities').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        universitiesData = data;
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  }

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

        const matchedUniversities = universitiesData.filter(uni => uni.majors.includes(major));
        modalMajorTitle.textContent = major + " - Partner Universities";
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
                  <div class="uni-detail-item"><span class="material-symbols-outlined">schedule</span><strong>Scheme:</strong> <span>${uni.scheme}</span></div>
                  <div class="uni-detail-item"><span class="material-symbols-outlined">calendar_today</span><strong>Intake:</strong> <span>${uni.intake}</span></div>
                  <div class="uni-detail-item"><span class="material-symbols-outlined">payments</span><strong>Living Cost:</strong> <span>${uni.cost}</span></div>
                  <div class="uni-detail-item"><span class="material-symbols-outlined">account_balance</span><strong>Tuition Fee:</strong> <span>${uni.tuition}</span></div>
                  <div class="uni-detail-item"><span class="material-symbols-outlined">card_membership</span><strong>Scholarship:</strong> <span>${uni.scholarship}</span></div>
                  <div class="uni-detail-item"><span class="material-symbols-outlined">workspace_premium</span><strong>Degree:</strong> <span>${uni.degree}</span></div>
                </div>
              </div>
            `;
          });
        }
        modalContent.innerHTML = htmlContent;
        uniModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => { uniModal.classList.add('hidden'); document.body.style.overflow = ''; };
    modalCloseBtn.addEventListener('click', closeModal);
    uniModal.addEventListener('click', (e) => { if (e.target === uniModal) closeModal(); });
  }

  // ── Partner Universities Directory Logic ───────────────────────
  let partnerUniversitiesData = [];
  const partnerBtn = document.getElementById('partner-univ-btn');
  const partnerModal = document.getElementById('partner-modal');
  const partnerCloseBtn = document.getElementById('partner-modal-close');
  const partnerSearchInput = document.getElementById('partner-search-input');
  const partnerCountryFilter = document.getElementById('partner-country-filter');
  const partnerContent = document.getElementById('partner-modal-content');

  async function loadGlobalPartners() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('global_partners').select('*').order('country', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        partnerUniversitiesData = data;
        populateCountryFilter();
      }
    } catch (error) {
      console.error("Error fetching global partners:", error);
    }
  }

  loadGlobalPartners(); // Note: moved from lazy due to dynamic filter prep.

  const populateCountryFilter = () => {
    if (!partnerCountryFilter) return;
    partnerUniversitiesData.forEach(item => {
      const option = document.createElement('option');
      option.value = item.country.toLowerCase();
      option.textContent = item.country;
      partnerCountryFilter.appendChild(option);
    });
  };

  const renderPartnerData = () => {
    const filterText = partnerSearchInput.value;
    const selectedCountry = partnerCountryFilter ? partnerCountryFilter.value : '';
    partnerContent.innerHTML = '';
    const lowerFilter = filterText.toLowerCase();

    partnerUniversitiesData.forEach(countryItem => {
      if (selectedCountry && countryItem.country.toLowerCase() !== selectedCountry) return;
      const matchingUnivs = countryItem.universities.filter(univ => univ.name.toLowerCase().includes(lowerFilter));
      if (filterText && matchingUnivs.length === 0) return;
      const univsToRender = filterText ? matchingUnivs : countryItem.universities;
      const card = document.createElement('div');
      card.className = 'country-card animate-up';
      let html = `<div class="country-header"><img src="https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/${countryItem.code}.svg" alt="${countryItem.country} flag" class="country-flag" loading="lazy"><h3>${countryItem.country}</h3></div><ul class="country-univ-list">`;
      univsToRender.forEach(univ => {
        html += `<li class="country-univ-item"><span class="univ-name">${univ.name}</span><span class="univ-period"><span class="material-symbols-outlined">schedule</span> Validity: ${univ.period}</span></li>`;
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
    const closePartnerModal = () => { partnerModal.classList.add('hidden'); document.body.style.overflow = ''; };
    partnerCloseBtn.addEventListener('click', closePartnerModal);
    partnerModal.addEventListener('click', (e) => { if (e.target === partnerModal) closePartnerModal(); });
    partnerSearchInput.addEventListener('input', renderPartnerData);
    if (partnerCountryFilter) partnerCountryFilter.addEventListener('change', renderPartnerData);
  }

  // ── Asistensi Logic ──────────────────────────────
  const asistensiVideoBtn = document.getElementById('asistensi-video-btn');
  const asistensiNotesBtn = document.getElementById('asistensi-notes-btn');
  const asistensiModal = document.getElementById('asistensi-modal');
  const asistensiModalTitle = document.getElementById('asistensi-modal-title');
  const asistensiModalContent = document.getElementById('asistensi-modal-content');
  const asistensiModalClose = document.getElementById('asistensi-modal-close');

  async function openAsistensiModal(type) {
    asistensiModalTitle.textContent = type === 'video' ? 'Video' : 'Notes';
    asistensiModalContent.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
    asistensiModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (!supabase) {
      asistensiModalContent.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h4>Error: Supabase not initialized</h4></div>';
      return;
    }

    let asistensiData = { video: [], notes: [] };

    try {
      const cachedData = sessionStorage.getItem('asistensiData');
      if (cachedData) {
        asistensiData = JSON.parse(cachedData);
      } else {
        const { data, error } = await supabase.from('asistensi').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          asistensiData.video = data.filter(item => item.type === 'video');
          asistensiData.notes = data.filter(item => item.type === 'notes');
          sessionStorage.setItem('asistensiData', JSON.stringify(asistensiData));
        }
      }
    } catch (error) {
      console.error("Error fetching asistensi:", error);
      asistensiModalContent.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h4>Error loading data.</h4></div>';
      return;
    }

    asistensiModalContent.innerHTML = '';
    
    if (asistensiData[type].length === 0) {
      asistensiModalContent.innerHTML = '<div style="text-align:center; padding: 40px 20px;"><h4 style="font-size: 20px; color: var(--bear-brown);">No data found.</h4></div>';
      return;
    }

    asistensiData[type].forEach(item => {
      const linkCard = document.createElement('a');
      linkCard.href = item.url;
      linkCard.target = '_blank';
      linkCard.className = 'uni-card';
      linkCard.style.textDecoration = 'none';
      linkCard.style.color = 'inherit';
      const iconName = type === 'video' ? 'play_circle' : 'menu_book';
      linkCard.innerHTML = `<span class="material-symbols-outlined" style="font-size: 40px; color: var(--cerulean-blue);">${iconName}</span><div class="uni-info" style="display: flex; align-items: center;"><h4 class="uni-name" style="margin: 0; font-size: 20px;">${item.title}</h4></div>`;
      asistensiModalContent.appendChild(linkCard);
    });
  }

  if (asistensiVideoBtn && asistensiNotesBtn && asistensiModal) {
    asistensiVideoBtn.addEventListener('click', (e) => { e.preventDefault(); openAsistensiModal('video'); });
    asistensiNotesBtn.addEventListener('click', (e) => { e.preventDefault(); openAsistensiModal('notes'); });
    if (asistensiModalClose) asistensiModalClose.addEventListener('click', () => { asistensiModal.classList.add('hidden'); document.body.style.overflow = ''; });
    asistensiModal.addEventListener('click', (e) => { if (e.target === asistensiModal) { asistensiModal.classList.add('hidden'); document.body.style.overflow = ''; } });
  }
}
