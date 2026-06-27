// js/diktat.js
import { supabase } from './supabase.js';

export function initDiktat() {
  const diktatContainer = document.getElementById('diktat-content-area');
  const diktatCourseModal = document.getElementById('diktat-course-modal');
  const diktatCourseTitle = document.getElementById('diktat-course-modal-title');
  const diktatCourseContent = document.getElementById('diktat-course-modal-content');
  const diktatCourseClose = document.getElementById('diktat-course-modal-close');
  
  const diktatArchiveModal = document.getElementById('diktat-archive-modal');
  const diktatArchiveContent = document.getElementById('diktat-archive-modal-content');
  const diktatArchiveClose = document.getElementById('diktat-archive-modal-close');

  async function openDiktatCourseModal(termTitle) {
    if (!supabase) return;
    diktatCourseTitle.textContent = termTitle + ' - Courses';
    diktatCourseContent.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
    diktatCourseModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    try {
      const cacheKey = 'diktatCourses_' + termTitle;
      const cachedData = sessionStorage.getItem(cacheKey);
      let data = [];
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        const response = await supabase.from('diktat_courses').select('*').eq('term', termTitle).order('course_name', { ascending: true });
        if (response.error) throw response.error;
        data = response.data;
        if (data && data.length > 0) {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      }
      let html = '';
      if (data && data.length > 0) {
        data.forEach(item => {
          html += `<a href="${item.url}" target="_blank" class="uni-card" style="text-decoration: none; color: inherit; display: flex; align-items: center; padding: 16px; background: rgba(255, 255, 255, 0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease;"><span class="material-symbols-outlined" style="font-size: 40px; color: var(--cerulean-blue); margin-right: 16px;">menu_book</span><div class="uni-info"><h4 class="uni-name" style="margin: 0; font-size: 18px;">${item.course_name}</h4></div></a>`;
        });
      } else {
        html = '<div style="text-align:center;"><p>No courses listed yet.</p></div>';
      }
      diktatCourseContent.innerHTML = html;
    } catch (err) {
      console.error(err);
      diktatCourseContent.innerHTML = '<div style="text-align:center;"><p>Failed to load courses.</p></div>';
    }
  }

  async function openDiktatArchiveModal() {
    if (!supabase) return;
    diktatArchiveContent.innerHTML = '<div class="skeleton-loader"></div><div class="skeleton-loader"></div>';
    diktatArchiveModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    try {
      const cacheKey = 'diktatArchive';
      const cachedData = sessionStorage.getItem(cacheKey);
      let data = [];
      if (cachedData) {
        data = JSON.parse(cachedData);
      } else {
        const response = await supabase.from('diktat_archive').select('*').order('term', { ascending: false });
        if (response.error) throw response.error;
        data = response.data;
        if (data && data.length > 0) {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      }
      let html = '';
      if (data && data.length > 0) {
        data.forEach(item => {
          html += `<a href="${item.url}" target="_blank" class="uni-card" style="text-decoration: none; color: inherit; display: flex; align-items: center; padding: 16px; background: rgba(255, 255, 255, 0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease;"><span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-muted); margin-right: 16px;">folder_open</span><div class="uni-info"><h4 class="uni-name" style="margin: 0; font-size: 18px;">${item.term}</h4></div></a>`;
        });
      } else {
        html = '<div style="text-align:center;"><p>No archives listed yet.</p></div>';
      }
      diktatArchiveContent.innerHTML = html;
    } catch (err) {
      console.error(err);
      diktatArchiveContent.innerHTML = '<div style="text-align:center;"><p>Failed to load archives.</p></div>';
    }
  }

  if (diktatCourseModal && diktatCourseClose) {
    const closeDiktatCourse = () => { diktatCourseModal.classList.add('hidden'); document.body.style.overflow = ''; };
    diktatCourseClose.addEventListener('click', closeDiktatCourse);
    diktatCourseModal.addEventListener('click', (e) => { if (e.target === diktatCourseModal) closeDiktatCourse(); });
  }
  
  if (diktatArchiveModal && diktatArchiveClose) {
    const closeDiktatArchive = () => { diktatArchiveModal.classList.add('hidden'); document.body.style.overflow = ''; };
    diktatArchiveClose.addEventListener('click', closeDiktatArchive);
    diktatArchiveModal.addEventListener('click', (e) => { if (e.target === diktatArchiveModal) closeDiktatArchive(); });
  }

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
          html += `<a href="#" data-title="${item.title}" class="main-info-card glass-card animate-up delay-${index + 1} diktat-top-item" style="display: block; text-decoration: none; color: inherit; width: 100%;"><h3>${item.title}</h3><div class="image-link-wrapper" style="margin-bottom: 0;"><img src="${item.image_url}" alt="${item.title}" class="landscape-image top-focus" loading="lazy"></div></a>`;
        });
        html += '</div><div class="diktat-bottom-row">';
        bottomItems.forEach((item, index) => {
          html += `<a href="#" class="main-info-card glass-card animate-up delay-${topItems.length + index + 1} diktat-bottom-item" style="display: block; text-decoration: none; color: inherit; width: 100%;"><h3>${item.title}</h3><div class="image-link-wrapper" style="margin-bottom: 0;"><img src="${item.image_url}" alt="${item.title}" class="landscape-image top-focus" loading="lazy"></div></a>`;
        });
        html += '</div>';
        diktatContainer.innerHTML = html;
        document.querySelectorAll('.diktat-top-item').forEach(el => { el.addEventListener('click', (e) => { e.preventDefault(); openDiktatCourseModal(el.getAttribute('data-title')); }); });
        document.querySelectorAll('.diktat-bottom-item').forEach(el => { el.addEventListener('click', (e) => { e.preventDefault(); openDiktatArchiveModal(); }); });
      }
    } catch (error) {
      console.error("Error fetching diktat:", error);
    }
  }
  loadDiktat();
}
